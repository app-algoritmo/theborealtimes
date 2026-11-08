# Boreal Times

Jornal digital da Duna Press sobre economia, ciência, tecnologia e geopolítica na Europa. Site estático em dois idiomas, gerado por um script Python. O conteúdo vive em arquivos markdown versionados no Git; a redação edita pelo painel em `/admin/`.

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
python3 publicar.py nova         # esqueleto de uma matéria
python3 publicar.py checar       # copidesque automático
python3 publicar.py construir    # gera site/
python3 publicar.py servir       # servidor local
```

Publicar é `git push`. O GitHub Actions roda o copidesque e **só publica se passar**.

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
conteudo/pt/edicoes/       peças em português
conteudo/pt/paginas/       institucionais e legais
conteudo/en/               equivalente em inglês
temas/boreal/              templates e CSS
temas/boreal/estatico/img/ favicon, ícones, imagem social
functions/                 autenticação por Stripe e entrega do conteúdo pago
_routes.json               quais rotas passam pelas Functions
admin/                     painel de redação (Sveltia CMS)
_headers, _redirects       configuração da Cloudflare
publicar.py                gerador e ferramentas de redação
site/                      saída gerada (não versionada)
```

## Front matter de uma peça

```yaml
---
numero: "001"
titulo: "Título afirmativo, sem adjetivo"
resumo: "Por que esta decisão importa — quem paga, onde, em que prazo."
secao: "Economia"         # Economia | Ciência | Tecnologia | Geopolítica
autor: "Nome próprio"          # assinatura coletiva é bloqueada
data: 2026-09-04
apuracao: "2026-09-02"
acesso: assinantes             # ou: aberta
informacao: "De onde vem: registros, documentos, fontes ouvidas, período."
---
```

**Paywall.** O corte é automático: os três primeiros parágrafos ficam abertos e o restante vai para `/restrito/`, servido só a quem tem sessão. O número de parágrafos está em `assinatura.paragrafos_abertos`.

Para cortar em outro ponto, insira a marca no texto — ela tem prioridade:

```
<!-- Tudo abaixo desta marca fica atrás do paywall -->
```

## O que o copidesque bloqueia

- Campo obrigatório ausente
- Assinatura coletiva ("Redação", "Equipe", "Newsroom")
- Peça que cita valores sem indicar como a informação foi obtida

## O que ele apenas avisa

- Superlativo de catálogo, em português e inglês
- Citação direta acima de 25 palavras
- Texto acima de 1.600 palavras
- Configuração pendente em `boreal.yaml`

## SEO já incluído

`hreflang` nos dois idiomas, sitemap com alternativas, JSON-LD de `NewsMediaOrganization` e `NewsArticle`, marcação de paywall (`isAccessibleForFree`) que permite indexação sem risco de cloaking, Open Graph com imagem 1200×630, favicon em SVG e PNG, webmanifest, meta tags geográficas e `llms.txt` para assistentes de IA que citarem a publicação.

Ver `DECISOES.md` para o porquê de cada escolha e `FLUXO.md` para o fluxo editorial da semana.
