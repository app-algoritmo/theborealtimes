#!/usr/bin/env python3
"""Gera a figurinha em 3D (GLB) de cada história para a realidade aumentada.

Uso (dentro da pasta do repositório):
    python3 ar/gerar_ar.py                 # todas as histórias
    python3 ar/gerar_ar.py apelido1 ...    # só as indicadas (apelido = nome da história em /pt/)

Saída: jogos/ar/<apelido>.glb  (cartão 16:9 com a arte da história, moldura
conforme a raridade, sobre uma base de pedra; 32 cm de largura, tamanho real).
Só usa Pillow; nenhum outro pacote. Os mesmos arquivos servem ao site e aos
futuros aplicativos (ARKit/ARCore)."""
import hashlib, io, json, re, struct, sys
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "jogos" / "ar"
IMG = RAIZ / "temas" / "boreal" / "estatico" / "img" / "materias"

def raridade(ap):
    h = int(hashlib.md5(ap.encode("utf-8")).hexdigest()[:8], 16) % 100
    return 0 if h < 60 else 1 if h < 85 else 2 if h < 96 else 3

# cor da moldura, metal, rugosidade, brilho próprio
MOLDURA = {0: ([0.29, 0.16, 0.48], 0.2, 0.7, [0, 0, 0]),
           1: ([0.78, 0.82, 0.88], 0.9, 0.35, [0, 0, 0]),
           2: ([0.91, 0.70, 0.30], 0.95, 0.30, [0.10, 0.07, 0.01]),
           3: ([0.55, 0.85, 1.00], 0.9, 0.25, [0.10, 0.25, 0.35])}

def caixa(w, h, d, cx=0, cy=0, cz=0):
    hx, hy, hz = w / 2, h / 2, d / 2
    faces = [((0, 0, 1), [(-hx, -hy, hz), (hx, -hy, hz), (hx, hy, hz), (-hx, hy, hz)]),
             ((0, 0, -1), [(hx, -hy, -hz), (-hx, -hy, -hz), (-hx, hy, -hz), (hx, hy, -hz)]),
             ((1, 0, 0), [(hx, -hy, hz), (hx, -hy, -hz), (hx, hy, -hz), (hx, hy, hz)]),
             ((-1, 0, 0), [(-hx, -hy, -hz), (-hx, -hy, hz), (-hx, hy, hz), (-hx, hy, -hz)]),
             ((0, 1, 0), [(-hx, hy, hz), (hx, hy, hz), (hx, hy, -hz), (-hx, hy, -hz)]),
             ((0, -1, 0), [(-hx, -hy, -hz), (hx, -hy, -hz), (hx, -hy, hz), (-hx, -hy, hz)])]
    P, N, UV, I = [], [], [], []
    for n, vs in faces:
        b = len(P)
        for k, v in enumerate(vs):
            P.append((v[0] + cx, v[1] + cy, v[2] + cz)); N.append(n)
            UV.append(((0, 1), (1, 1), (1, 0), (0, 0))[k])
        I += [b, b + 1, b + 2, b, b + 2, b + 3]
    return P, N, UV, I

def plano(w, h, cy, z, frente=True):
    hx, hy = w / 2, h / 2
    if frente:
        P = [(-hx, cy - hy, z), (hx, cy - hy, z), (hx, cy + hy, z), (-hx, cy + hy, z)]; n = (0, 0, 1)
        UV = [(0, 1), (1, 1), (1, 0), (0, 0)]
    else:
        P = [(hx, cy - hy, z), (-hx, cy - hy, z), (-hx, cy + hy, z), (hx, cy + hy, z)]; n = (0, 0, -1)
        UV = [(0, 1), (1, 1), (1, 0), (0, 0)]
    return P, [n] * 4, UV, [0, 1, 2, 0, 2, 3]

def glb(ap, jpeg, q):
    W, H, D = 0.32, 0.1888, 0.008
    iw, ih = 0.30, 0.16875
    base_h = 0.022
    cy = base_h + H / 2 - 0.004
    cor, met, rug, emi = MOLDURA[q]
    prims = [
        (caixa(W, H, D, 0, cy, 0), 0),                       # moldura
        (plano(iw, ih, cy, D / 2 + 0.0004, True), 1),        # arte, frente
        (plano(iw, ih, cy, -D / 2 - 0.0004, False), 2),      # arte, verso (mais escura)
        (caixa(0.15, base_h, 0.05, 0, base_h / 2, 0), 3),    # base de pedra
    ]
    mats = [
        {"name": "moldura", "pbrMetallicRoughness": {"baseColorFactor": cor + [1], "metallicFactor": met, "roughnessFactor": rug}, "emissiveFactor": emi},
        {"name": "arte", "pbrMetallicRoughness": {"baseColorTexture": {"index": 0}, "metallicFactor": 0, "roughnessFactor": 0.55},
         "emissiveTexture": {"index": 0}, "emissiveFactor": [0.45, 0.45, 0.45]},
        {"name": "verso", "pbrMetallicRoughness": {"baseColorTexture": {"index": 0}, "baseColorFactor": [0.35, 0.35, 0.4, 1], "metallicFactor": 0, "roughnessFactor": 0.8}},
        {"name": "pedra", "pbrMetallicRoughness": {"baseColorFactor": [0.20, 0.19, 0.22, 1], "metallicFactor": 0.05, "roughnessFactor": 0.95}},
    ]
    binb = bytearray(); views, accs, mprims = [], [], []
    def add(data, target=None):
        while len(binb) % 4: binb.append(0)
        views.append({"buffer": 0, "byteOffset": len(binb), "byteLength": len(data), **({"target": target} if target else {})})
        binb.extend(data); return len(views) - 1
    for (P, N, UV, I), m in prims:
        pv = add(struct.pack("<%df" % (len(P) * 3), *[c for p in P for c in p]), 34962)
        nv = add(struct.pack("<%df" % (len(N) * 3), *[c for p in N for c in p]), 34962)
        uv = add(struct.pack("<%df" % (len(UV) * 2), *[c for p in UV for c in p]), 34962)
        iv = add(struct.pack("<%dH" % len(I), *I), 34963)
        xs, ys, zs = zip(*P)
        base = len(accs)
        accs += [{"bufferView": pv, "componentType": 5126, "count": len(P), "type": "VEC3", "min": [min(xs), min(ys), min(zs)], "max": [max(xs), max(ys), max(zs)]},
                 {"bufferView": nv, "componentType": 5126, "count": len(N), "type": "VEC3"},
                 {"bufferView": uv, "componentType": 5126, "count": len(UV), "type": "VEC2"},
                 {"bufferView": iv, "componentType": 5123, "count": len(I), "type": "SCALAR"}]
        mprims.append({"attributes": {"POSITION": base, "NORMAL": base + 1, "TEXCOORD_0": base + 2}, "indices": base + 3, "material": m})
    iv = add(jpeg)
    doc = {"asset": {"version": "2.0", "generator": "Boreal Saga Play"},
           "scene": 0, "scenes": [{"nodes": [0]}], "nodes": [{"mesh": 0, "name": ap}],
           "meshes": [{"primitives": mprims}], "materials": mats,
           "textures": [{"sampler": 0, "source": 0}], "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 33071, "wrapT": 33071}],
           "images": [{"bufferView": iv, "mimeType": "image/jpeg"}],
           "accessors": accs, "bufferViews": views, "buffers": [{"byteLength": len(binb)}]}
    js = json.dumps(doc, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    while len(binb) % 4: binb.append(0)
    total = 12 + 8 + len(js) + 8 + len(binb)
    return struct.pack("<4sII", b"glTF", 2, total) + struct.pack("<I4s", len(js), b"JSON") + js + struct.pack("<I4s", len(binb), b"BIN\0") + bytes(binb)

def historias():
    out = {}
    for f in sorted((RAIZ / "conteudo" / "pt" / "materias").glob("*.md")):
        t = f.read_text(encoding="utf-8")
        m = re.search(r'^imagem:\s*"?([^"\n]+)"?', t, re.M)
        if not m: continue
        ap = re.sub(r"^\d{4}-\d{2}-\d{2}-", "", f.stem)
        out[ap] = Path(m.group(1)).name
    return out

def main():
    H = historias(); alvo = sys.argv[1:] or list(H)
    SAIDA.mkdir(parents=True, exist_ok=True)
    for ap in alvo:
        if ap not in H: print("sem história:", ap); continue
        arq = IMG / H[ap]
        if not arq.exists(): print("sem imagem:", ap); continue
        im = Image.open(arq).convert("RGB").resize((1024, 576), Image.LANCZOS)
        b = io.BytesIO(); im.save(b, "JPEG", quality=82, optimize=True)
        dados = glb(ap, b.getvalue(), raridade(ap))
        (SAIDA / f"{ap}.glb").write_bytes(dados)
        print(f"{ap}.glb  {len(dados)//1024} KB  raridade {raridade(ap)}")

if __name__ == "__main__":
    main()
