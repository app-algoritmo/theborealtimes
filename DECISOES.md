# Decisões de arquitetura

Registro do que foi decidido e por quê. Serve para não refazer a mesma discussão em seis meses.

## Reformulação de novembro de 2026

O The Boreal Times deixou de ser um jornal de economia, ciência, tecnologia e geopolítica na Europa. Passou a contar histórias da Escandinávia e do mundo nórdico, de todos os tempos: mitos, sagas, lendas, contos de fadas, era viking, reis e deuses, e acontecimentos históricos. As histórias podem ser verdadeiras, lendárias ou inventadas.

"Times", no nome, passa a significar "tempos", e o nome continua.

Motivo: o conceito anterior dependia de apuração própria de pauta de defesa e indústria, que a operação não sustenta. Histórias do Norte são conteúdo perene, com público de busca constante, e o material-base (Eddas, sagas, arqueologia) é público e documentado.

## Escopo geográfico

"Escandinávia" estrita é Noruega, Suécia e Dinamarca. Mas as sagas e os mitos vêm em grande parte da Islândia, e a era viking inclui Finlândia, Islândia, Groenlândia e as ilhas do Atlântico Norte. O escopo editorial é **a Escandinávia e o mundo nórdico**.

## Cinco seções

Mitos e Deuses, Sagas e Reis, Era Viking, Contos e Folclore, História. Os nomes anteriores (Economia, Ciência, Tecnologia, Geopolítica) foram abandonados. A página de cada seção descreve o que cabe nela.

## Natureza declarada

Como a coleção mistura verdade, tradição e invenção, **todo texto declara uma natureza**: História documentada, Saga ou fonte medieval, Mito ou lenda, ou Conto original. Não é enfeite: é o que impede o leitor, e o Google, de tomar lenda por fato. Só o conto original dispensa a lista de fontes.

## Quem escreve: IA, com editor responsável

Os textos são narrados por inteligência artificial, e o site diz isso em todas as páginas de texto (selo no cabeçalho), na página "Quem somos" e nos princípios. O selo antigo "Reportagem humana" foi removido: seria falso.

O campo `autor` passou a guardar o **editor responsável**, e o JSON-LD declara a Organização como autora e a pessoa como `editor`. Declarar a pessoa como autora seria falso.

A página de princípios promete que o editor lê cada texto antes de publicar. **Essa promessa precisa ser verdadeira.** Além de honestidade, é o que o AdSense exige: conteúdo gerado em escala e publicado sem revisão humana é motivo comum de reprovação.

## Verdade e fontes

IA erra data, nome e atribuição, e inventa citação. Por isso toda natureza, exceto o conto original, exige o campo `fontes`, e o copidesque recusa a publicação sem ele. A conferência de que as fontes existem e dizem o que o texto atribui a elas é humana.

Não reproduzimos traduções protegidas. Mitos e sagas em domínio público são livres; a nossa versão do texto é que tem proteção.

## Respeito

A mitologia nórdica é religião viva para muita gente (o ásatrú), e símbolos e histórias vikings são usados por movimentos de extrema direita. O site trata a religião com respeito e não serve de vitrine para supremacismo.

## Imagens

Podem ser ilustrações geradas por IA. A legenda diz isso, o copidesque avisa se o crédito não diz, e o texto alternativo é obrigatório.

## Relação com a Duna Press

O Boreal Times é "elaborado por Duna Press". A Duna segue com jornalismo diário; o Boreal não publica notícias. O aviso antigo de "o que sai aqui não sai lá" deixou de fazer sentido, porque os dois não disputam mais o mesmo assunto.

## Modelo

Site aberto, inteiramente gratuito, com publicidade de rede. Quem prefere ler sem anúncio assina pelo aplicativo. A assinatura não compra acesso, compra silêncio. A loja fica com a comissão e responde por cobrança e reembolso.

O paywall por trecho, o conteúdo em `/restrito/` e a autenticação sem senha, previstos antes, **não existem no código** e saíram dos documentos.

## Editora e exposição jurídica

O Boreal Times é elaborado por Duna Press. A representação legal e a titularidade são de **Digital Solutions - De Barros**, org.nr 996 041 468, registrada na Noruega, com sede em Larvik. Não existe "Boreal Times AS".

É um **enkeltpersonforetak**: não há separação patrimonial, e o editor responde pessoalmente. Com conteúdo de história e folclore a exposição é bem menor que na cobertura de defesa, mas continua valendo reavaliar com advogado, em especial sobre direitos autorais e uso de IA. Ponto em aberto.

## Hospedagem: Cloudflare Pages

Mantém o `git push`, é gratuito nesta faixa de uso e serve o site estático. **Não há GitHub Actions no repositório**: o copidesque não roda sozinho.

## Idioma: português principal, inglês em /en/

Sem detecção por IP. `hreflang` correto, troca manual visível no topo, e uma faixa discreta que sugere o outro idioma conforme o navegador. Sugestão, não desvio.

## Domínio: borealtimes.org

O `.org` mantém simetria com `dunapress.org`. O `.no` pertence à casa e serve como redirecionamento.

## Medição: GA4 com consentimento

Entra em modo negado e só mede depois do aceite explícito, como exige o GDPR. Vale considerar alternativa sem cookies (Plausible, Umami).

## CMS: Sveltia, sobre Git

Painel em `/admin/`, editando os mesmos arquivos markdown do repositório. Cada publicação vira um commit com autoria e histórico.
