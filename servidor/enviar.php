<?php
// Envia uma edição da newsletter aos assinantes ativos. SÓ roda pelo terminal (Unix shell do Domeneshop).
//
//   php enviar.php SEGREDO pt edicao-pt.txt          (prova: só mostra, não envia)
//   php enviar.php SEGREDO pt edicao-pt.txt enviar   (envia de verdade)
//
// O arquivo .txt tem o assunto na primeira linha, uma linha em branco e o corpo em texto.
// O link de cancelamento é acrescentado ao fim de cada mensagem automaticamente.
define('BT', 1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/comum.php';

[$_, $segredo, $idioma, $arquivo] = array_pad($argv, 4, '');
$real = ($argv[4] ?? '') === 'enviar';
$c = cfg();
if (!hash_equals($c['segredo'], $segredo) || !is_file($arquivo)) { fwrite(STDERR, "Uso: php enviar.php SEGREDO pt|en arquivo.txt [enviar]\n"); exit(1); }

$idioma = limpar_idioma($idioma);
$bruto = file_get_contents($arquivo);
[$assunto, $corpo] = array_pad(explode("\n", $bruto, 2), 2, '');
$assunto = trim($assunto); $corpo = trim($corpo);
if ($assunto === '' || $corpo === '') { fwrite(STDERR, "Arquivo precisa de assunto e corpo.\n"); exit(1); }

$st = db()->prepare("SELECT email, token_cancela FROM boreal_assinantes WHERE estado='ativo' AND idioma = ?");
$st->execute([$idioma]);
$n = 0;
foreach ($st as $a) {
  $link = $c['base_url'] . '/cancelar.php?l=' . $idioma . '&t=' . $a['token_cancela'];
  $rodape = $idioma === 'en'
    ? "\n\n--\nYou receive this because you subscribed at {$c['site']}/en/.\nUnsubscribe: $link\n"
    : "\n\n--\nVocê recebe esta mensagem porque se inscreveu em {$c['site']}/.\nCancelar: $link\n";
  if ($real) {
    enviar_email($a['email'], $assunto, $corpo . $rodape, ["List-Unsubscribe: <$link>"]);
    usleep(400000); // ~2 mensagens por segundo, para não estourar o limite do servidor
  }
  $n++;
}
echo ($real ? "Enviado a $n assinante(s).\n" : "Prova: $n assinante(s) receberiam esta mensagem.\n");
