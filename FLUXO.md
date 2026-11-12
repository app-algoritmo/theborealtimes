# Fluxo editorial

Quatro seções: Mitos e Deuses, Sagas e Reis, Era Viking, Contos e Folclore. História documentada entra em Era Viking ou Sagas e Reis. Sem periodicidade prometida: o site publica quando o texto está pronto.

## Publicar um texto

1. Abrir uma conversa nova, colar o `PROMPT.md` e dizer o tema.
2. Ler o texto que volta. O editor responsável lê cada texto antes de publicar; esta é a promessa que a página de princípios faz ao leitor.
3. Conferir as fontes listadas: obra e autor existem? A atribuição é verdadeira?
4. Salvar o arquivo em `conteudo/pt/materias/` (e, se houver versão, em `conteudo/en/materias/`).

```bash
python3 publicar.py checar      # copidesque
python3 publicar.py construir   # gera o site
python3 publicar.py servir      # conferir em localhost:8000
git add . && git commit -m "..." && git push
```

A Cloudflare Pages constrói e publica a partir do `git push`. O `checar` não roda sozinho: rode-o antes.

## Antes de publicar, cada texto responde

A natureza está certa? Mito e lenda não aparecem como fato; saga não aparece como registro exato; conto original aparece como ficção.

Cada fato de "História documentada" tem fonte que o sustenta? Data incerta está escrita como incerta?

As fontes listadas existem, e dizem o que o texto atribui a elas? Nenhuma citação foi inventada.

Há trecho que distorce o passado nórdico a serviço de supremacismo ou extremismo? Se houver, o trecho sai.

A imagem, se existir, tem crédito, texto alternativo e, quando for gerada por IA, diz isso na legenda?

## Onde a automação entra

**Entra:** conversão de markdown em site, capa, páginas de seção, feeds, SEO, verificação de campos e vocabulário, publicação por `git push`.

**Redação:** a IA narra. A leitura, a verificação das fontes e a decisão de publicar são do editor responsável. A página de princípios declara isso ao leitor, e ela só tem valor se for verdadeira.
