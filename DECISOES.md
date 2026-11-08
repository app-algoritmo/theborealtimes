# Decisões de arquitetura

Registro do que foi decidido e por quê. Serve para não refazer a mesma discussão em seis meses.

## O que a publicação cobre

O dinheiro público e privado que está redesenhando a Europa, visto de quatro ângulos: **Economia** (orçamento, dívida, contrato público, gasto militar), **Ciência** (pesquisa e quem a financia), **Tecnologia** (data center, IA, semicondutor, rede, cabo) e **Geopolítica** (defesa, alianças, sanções, fronteiras).

Os nomes anteriores — Defesa, Infraestrutura, Território, Capital — descreviam bem o conteúdo e vendiam mal. Estes cobrem o mesmo material com vocabulário que o leitor reconhece: o gasto militar entra em Economia, a infraestrutura entra em Tecnologia, o território entra em Geopolítica.

Escopo europeu, Rússia incluída. A Escandinávia não é recorte: é de onde a redação observa. Escrever "Escandinávia e Europa" seria erro geográfico e sinal de descuido logo na linha que define o jornal.

A vantagem de estar no norte é de apuração, não de assunto: documentos nórdicos sobre aquisição militar, licença de rede e fila de conexão elétrica são públicos, estão em língua original e quase não são lidos fora da região.

Conceitos anteriores — revista de luxo, preço apurado de ativos, "como a riqueza se move" — foram abandonados por dependerem de uma rede de fontes no mercado de luxo brasileiro que não existe. Este é o primeiro com vantagem competitiva real.

Não há lista de espera. A publicação está ativa desde dezembro de 2025; o site não se apresenta como pré-lançamento.

## Modelo

Site aberto, inteiramente gratuito, com publicidade de rede. Quem prefere ler sem anúncio assina pelo aplicativo, na App Store ou no Google Play.

A assinatura não compra acesso — compra silêncio. Isso evita a armadilha de prometer conteúdo exclusivo que depois não se sustenta, e mantém todo o acervo disponível para busca, que é de onde vem o tráfego que paga a publicidade.

Consequência aceita: a loja fica com a comissão, define moeda e preço, e responde por reembolso. Em troca resolve cobrança internacional, IVA e renovação sem infraestrutura nossa.

## O que a publicação vende

Informação, e nada além disso. Não intermediamos, não anunciamos, não recebemos comissão, não prestamos inteligência a governo ou indústria, e não damos aconselhamento individual.

Isso não é postura moral: é o que torna o produto vendável. Quem vende dica é julgado pelo retorno da dica. Quem vende entendimento é julgado pela clareza, e não tem placar contra si.

Há também a razão regulatória: a editora está no Espaço Econômico Europeu, onde recomendação de investimento traz obrigações formais e aconselhamento personalizado exige autorização.

## Comunicação oficial é fonte, não fato

A regra mais importante desta cobertura. Declaração de governo, ministério, força armada, aliança ou empresa é sempre atribuída a quem emitiu, com data e canal.

Isso vale para todos os lados, sem exceção. Em tempo de guerra todo Estado comunica com objetivo — e isso inclui aliados. Um jornal que reproduz comunicado como apuração vira canal de propaganda, e o leitor que paga percebe antes de qualquer crítico.

## Limites na cobertura de defesa

Cobrimos dinheiro, contrato, indústria e decisão. Não publicamos posição, movimentação, prontidão ou vulnerabilidade de forças, nem agregamos fragmentos públicos até formar retrato de capacidade operacional.

A legislação norueguesa de segurança restringe parte disso, mas a regra é mais ampla que a lei: nenhuma peça deve ser útil para escolher um alvo.

## Editora e exposição jurídica

O Boreal Times é uma extensão da **Duna Press** e assim se apresenta ao leitor. A representação legal e a titularidade são de **Digital Solutions - De Barros**, org.nr 996 041 468, registrada na Noruega, com sede em Larvik. Não existe "Boreal Times AS" — a menção a essa entidade foi removida de todas as páginas.

É um **enkeltpersonforetak**, o que significa que não há separação patrimonial: o editor responde pessoalmente. Para uma cobertura de defesa e indústria, com partes que têm departamento jurídico, essa exposição é relevante e vale reavaliar com advogado. Fica registrado como ponto em aberto.

Consequência prática já aplicada: direito de resposta antes da publicação virou regra escrita no fluxo, não cortesia.

## Hospedagem: Cloudflare Pages

GitHub Pages não executa código, logo não faz paywall real. Cloudflare Pages mantém o `git push`, é gratuito nesta faixa de uso, e as Functions rodam a autenticação e a entrega do conteúdo pago.

## Paywall: o conteúdo pago não está no HTML público

Cada peça é dividida por uma marca no markdown. O trecho aberto entra na página; o trecho pago é gravado em `/restrito/{idioma}/{slug}.html` e servido apenas pela Function, depois de verificar a sessão.

A alternativa comum — publicar tudo e esconder com CSS — é contornada por qualquer leitor que abra o código-fonte.

## Autenticação sem senha

O leitor informa o e-mail. A Function verifica se há assinatura ativa e envia um endereço de acesso válido por quinze minutos, que vira cookie de sessão de trinta dias.

Nenhuma senha para vazar, nenhuma base de credenciais para proteger. A resposta é sempre a mesma, haja assinatura ou não: confirmar quem assina vazaria a lista de leitores, que numa publicação de defesa é informação sensível por si só.

## Venda nas lojas, leitura aberta na web

A assinatura é vendida e cobrada na App Store e no Google Play. A web é aberta até o terceiro parágrafo de cada peça, e dali em diante convida a assinar.

Consequências a aceitar de olhos abertos: a loja fica com a comissão (30% no primeiro ano, 15% depois, nas faixas usuais), define a moeda e o preço, e é ela quem responde por reembolso. Em troca, resolve cobrança internacional, IVA e renovação sem nenhuma infraestrutura nossa.

**Pendência técnica.** A verificação de assinatura em `/entrar/` ainda consulta o Stripe. Para o assinante do aplicativo ler na web, isso precisa passar a validar recibo da Apple e do Google. Enquanto não for feito, a web entrega o trecho aberto a todos e o trecho pago a ninguém.

## Idioma: português principal, inglês em /en/

Sem detecção por IP. O leitor viaja e usa VPN; IP acerta o país e erra a pessoa. Além disso, redirecionamento por IP entrega ao Googlebot uma versão diferente da que o leitor vê, atrapalhando a indexação das duas.

`hreflang` correto, troca manual visível no topo, e uma faixa discreta que sugere o outro idioma conforme o navegador. Sugestão, não desvio.

## Domínio: borealtimes.org

O `.org` carrega leitura institucional, que é o registro certo para uma publicação sem anúncio, e mantém simetria com `dunapress.org`, da mesma casa.

O `.com` foi registrado por terceiro em novembro de 2026, depois de consulta de disponibilidade — lição: checar domínio apenas no registrador onde se vai comprar. O `.no` pertence à casa e serve como redirecionamento, não como endereço do jornal: `.no` diria Noruega onde o produto diz Europa.

## Medição: GA4 com consentimento

Entra em modo negado e só mede depois do aceite explícito, como exige o GDPR.

Vale considerar alternativa sem cookies (Plausible, Umami). Uma publicação que promete não fazer publicidade comportamental fica mais coerente sem o pixel do Google.

## CMS: Sveltia, sobre Git

Painel em `/admin/`, editando os mesmos arquivos markdown do repositório. Cada publicação vira um commit com autoria e histórico — que, num jornal que publica afirmação sobre contrato público, é a prova de quando cada coisa foi publicada e por quem.
