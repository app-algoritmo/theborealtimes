# Fluxo editorial

Quatro editorias: Economia, Ciência, Tecnologia, Geopolítica. Sem periodicidade prometida — o jornal publica quando tem matéria apurada.

## Publicar uma matéria

```bash
python3 publicar.py nova        # cria o esqueleto com a data de hoje
# escrever
python3 publicar.py checar      # copidesque
python3 publicar.py construir   # gera o site
python3 publicar.py servir      # conferir em localhost:8000
git add . && git commit -m "..." && git push
```

O `git push` dispara o GitHub Actions, que roda o copidesque e **só publica se passar**.

## Antes de publicar, cada matéria responde

Como a informação chegou — registro público, documento ou fonte.

Se há afirmação de fato sustentada por uma única fonte. Se houver, busca-se a segunda ou a frase muda de status.

Se alguma declaração oficial está escrita como se fosse fato nosso. Se estiver, é atribuída a quem a emitiu, com data e canal.

Se alguém citado desfavoravelmente teve prazo real de resposta.

Se a matéria deixa de descrever e passa a aconselhar. Se passa, corta-se o trecho.

**E a pergunta de segurança, quando o assunto for defesa:** isto diz algo sobre posição, movimentação, prontidão ou vulnerabilidade? Seria útil para escolher um alvo? Se sim, o trecho sai — mesmo que cada informação seja pública em separado.

## Não repetir a Duna

O que sai no Boreal não sai na Duna Press, e o contrário também vale. As duas publicações tocam nos mesmos assuntos e nunca no mesmo texto.

Isso não é só higiene editorial: conteúdo igual em dois domínios do mesmo dono faz o Google escolher um e descartar o outro, e pode afetar a aprovação de publicidade nos dois.

## Como escrever a abertura

O site é aberto e sem corte de leitura. Mas o primeiro parágrafo continua sendo o que decide se alguém lê o resto, e é ele que aparece na busca e nas redes.

Fato primeiro, contexto depois.

## Onde a automação entra — e onde não entra

**Entra:** conversão de markdown em site, capa, páginas de editoria, feeds, SEO, verificação de campos e vocabulário, publicação por `git push`.

**Não entra:** apuração, entrevista, verificação de fato, julgamento editorial, redação da matéria. A página de princípios declara isso ao leitor, e ela só tem valor se for verdadeira.
