# The Boreal Times

Site de histórias do Norte — mitos, sagas, lendas, contos e história da Escandinávia e do mundo nórdico — elaborado por Duna Press. Textos narrados por inteligência artificial. Site estático em dois idiomas, gerado por um script Python. O conteúdo vive em arquivos markdown versionados no Git; a redação edita pelo painel em `/admin/`.

---

## Instalação no MacBook

```bash
xcode-select --install
brew install git python

cd ~/Documents/theborealtimes
python3 -m venv .venv
source .venv/bin/activate
pip install -r requisitos.txt

python3 publicar.py construir
python3 publicar.py servir      # http://localhost:8000
```

## Comandos do dia a dia

```bash
python3 publicar.py nova         # esqueleto de um texto
python3 publicar.py checar       # copidesque automático
python3 publicar.py construir    # gera site/
python3 publicar.py servir       # servidor local
```

Publicar é `git push`; a Cloudflare Pages constrói o site a partir do repositório. **Não há GitHub Actions neste repositório**: o `checar` roda só quando a pessoa o executa, e deve ser rodado antes de cada `git push`.

---

## Subir e colocar no ar

```bash
git init -b main
git add .
git commit -m "Boreal Times: estrutura inicial"
git remote add origin https://github.com/app-algoritmo/theborealtimes.git
git push -u origin main
```

**Cloudflare Pages** — em dash.cloudflare.com → Workers & Pages → Create → Pages → conectar o repositório. Build command: `pip install -r requisitos.txt && python publicar.py construir`. Output directory: `site`.

Depois, em Custom domains, adicione `borealtimes.org` e `www.borealtimes.org`. Se o DNS já estiver na Cloudflare, o apontamento é automático. **Remova antes o redirecionamento atual para dunapress.org.**

Para publicar pelo GitHub Actions em vez do build automático, crie os segredos `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` no repositório.

---

## Painel de redação

Em `borealtimes.org/admin/`. O login é feito com a conta do GitHub. Cada pessoa da redação precisa de acesso de escrita ao repositório — é assim que a autoria fica registrada.

---

## Publicidade e medição

Tudo configurado em `boreal.yaml`, sem variáveis de ambiente:

| Campo | Valor |
|---|---|
| `medicao.ga4` | `G-F8DGD8SR0E` |
| `publicidade.adsense` | `ca-pub-7977428997189299` |

O `ads.txt` é gerado automaticamente a partir do ID do AdSense.

A janela de consentimento é a CMP certificada do Google, configurada no painel do AdSense em **Privacidade e mensagens** e servida pelo próprio script de anúncios. Não há banner próprio no código: um banner artesanal não serve para publicidade no Espaço Econômico Europeu.

O GA4 entra com consentimento negado por padrão e a CMP atualiza esse estado.

**Ordem para o AdSense:** o Google não aprova site sem conteúdo. Publique algumas matérias, deixe o site rodando algumas semanas, e só então peça aprovação.

## O que preencher antes do lançamento

Em `boreal.yaml`:

- `assinatura.aplicativos.apple` e `.google` — endereços nas lojas
- `medicao.verificacao_google` — meta tag do Search Console (depois do site no ar)
- `site.redes` — perfis reais

Depois disso:

- [ ] Revisão jurídica de `termos.md`, `privacidade.md` e `cookies.md`
- [ ] Confirmar com contador norueguês o enquadramento de MVA da publicação
- [ ] Verificar necessidade de registro de IVA para leitores na União Europeia
- [ ] Registrar o sitemap no Search Console
- [ ] Publicar matérias antes de pedir aprovação do AdSense
- [ ] Verificar o domínio no Search Console por registro TXT

---

## Estrutura

```
boreal.yaml                identidade, idiomas, planos, medição, checkout
conteudo/pt/materias/      textos em português
conteudo/pt/paginas/       institucionais e legais
conteudo/en/               equivalente em inglês
temas/boreal/              templates e CSS
temas/boreal/estatico/img/ favicon, ícones, imagem social
admin/                     painel de redação (Sveltia CMS)
_headers, _redirects       configuração da Cloudflare
publicar.py                gerador e ferramentas de redação
site/                      saída gerada (não versionada)
```

## Front matter de um texto

```yaml
---
titulo: "Título afirmativo, sem adjetivo de catálogo"
resumo: "Uma ou duas frases, entre 120 e 180 caracteres."
secao: "Mitos e Deuses"   # Mitos e Deuses | Sagas e Reis | Era Viking | Contos e Folclore | História
natureza: "Mito ou lenda" # História documentada | Saga ou fonte medieval | Mito ou lenda | Conto original
autor: "Paulo Fernando de Barros"   # editor responsável; o texto é narrado por IA
data: 2026-11-12
imagem: ""
imagem_credito: ""        # ex.: Ilustração gerada por inteligência artificial (Qwen)
imagem_alt: ""            # obrigatório se houver imagem
fontes: []                # obrigatório, exceto em "Conto original"
tags: []
---
```

Em inglês, as seções são `Myths & Gods`, `Sagas & Kings`, `Viking Age`, `Tales & Folklore` e `History`, e as naturezas são `Documented history`, `Saga or medieval source`, `Myth or legend` e `Original tale`. As listas oficiais ficam em `boreal.yaml`.

## O que o copidesque bloqueia

- Campo obrigatório ausente (inclui `natureza`)
- Seção ou natureza fora das listas do idioma
- Natureza que exige fonte (todas, exceto conto original) sem o campo `fontes`
- Imagem sem `imagem_credito` ou sem `imagem_alt`
- O campo `autor` com assinatura coletiva ("Redação", "Equipe", "Newsroom", "Staff")

## O que ele apenas avisa

- Texto fora da faixa de 400 a 1.500 palavras
- Superlativo de catálogo
- Citação direta acima de 40 palavras
- Crédito de imagem que não diz se é ilustração de IA
- Configuração pendente em `boreal.yaml`

## SEO já incluído

`hreflang` nos dois idiomas, sitemap com alternativas, JSON-LD de `Organization` e `Article` (autoria da organização, editor responsável como `editor`, natureza como `genre`), Open Graph, favicon, webmanifest, meta tags geográficas e `llms.txt`.

Ver `DECISOES.md` para o porquê de cada escolha, `FLUXO.md` para o fluxo editorial e `PROMPT.md` para o prompt que gera os textos.
