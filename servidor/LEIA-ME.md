# Newsletter do Boreal Times — servidor (Domeneshop)

Estes arquivos NÃO fazem parte do site na Cloudflare. Eles vão por FTP para o webhotel do Domeneshop
(dsnorge.com) e gravam os assinantes no banco MySQL.

## Instalação (uma vez)

1. Domeneshop > Min konto > dsnorge.com > Webhosting > MySQL > "Opprett ny database". Anote o nome do banco, o servidor, o usuário e a senha.
2. phpMyAdmin do banco novo > aba SQL > cole o conteúdo de `banco.sql` > Executar.
3. Copie `config.exemplo.php` para `config.php` e preencha banco, usuário, senha e o `segredo`.
4. Por FTP, crie a pasta `boreal` na raiz do webhotel (a mesma onde está o site dsnorge.com) e envie para ela:
   `inscrever.php`, `confirmar.php`, `cancelar.php`, `comum.php`, `enviar.php`, `config.php`, `.htaccess`.
   Nunca envie `config.php` para o GitHub.
5. Teste abrindo https://dsnorge.com/boreal/inscrever.php no navegador: deve aparecer `{"ok":false,"erro":"metodo"}`.
6. Faça uma inscrição de teste em borealtimes.org/assinatura/ com o seu e-mail e confira se a mensagem chega.

## Remetente e caixa de spam

O PHP envia pelo servidor do Domeneshop. Para a mensagem chegar na caixa de entrada, o endereço de
`de_email` deve ser de um domínio autorizado a enviar por esse servidor. Se a confirmação cair no spam ou
não chegar, troque `de_email` por um endereço @dsnorge.com e mantenha `responder_para` como
post@borealtimes.org. Quando a lista crescer, vale ligar SPF, DKIM e DMARC no borealtimes.org ou usar um
serviço de envio (Brevo, MailerLite).

## Enviar uma edição

No Unix shell do Domeneshop, dentro da pasta `boreal`, com um arquivo de texto cujo 1º linha é o assunto,
seguido de linha em branco e do corpo:

    php enviar.php SEGREDO pt edicao-pt.txt            (prova, não envia)
    php enviar.php SEGREDO pt edicao-pt.txt enviar     (envia)

O link de cancelamento é acrescentado automaticamente.

## Ver ou apagar dados

phpMyAdmin > tabela `boreal_assinantes`. Pedidos de eliminação de dados (LGPD/GDPR): apague a linha do e-mail.
