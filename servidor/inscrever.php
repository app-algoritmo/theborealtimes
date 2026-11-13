<?php
define('BT', 1);
require __DIR__ . '/comum.php';
cors();

$ajax = ($_POST['via'] ?? '') === 'js';
function sair($ok, $erro, $idioma, $ajax) {
  if ($ajax) json($ok ? ['ok' => true] : ['ok' => false, 'erro' => $erro], $ok ? 200 : 400);
  ir(pagina_site($idioma, $ok ? '?status=pendente' : ''));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') json(['ok' => false, 'erro' => 'metodo'], 405);

$idioma = limpar_idioma($_POST['idioma'] ?? 'pt');
$email = strtolower(trim($_POST['email'] ?? ''));
$c = cfg();

// Armadilha para robôs: o campo "site" fica escondido e humano nunca preenche.
// Preenchido, ou enviado rápido demais (menos de 2 s), responde "ok" sem gravar.
if (($_POST['site'] ?? '') !== '' || (int)($_POST['t'] ?? 9999) < 2000) sair(true, '', $idioma, $ajax);

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) sair(false, 'email', $idioma, $ajax);
if (($_POST['consentimento'] ?? '') !== '1') sair(false, 'aceite', $idioma, $ajax);

try {
  $db = db();

  // Freio global contra enchente de inscrições
  $n = $db->query("SELECT COUNT(*) FROM boreal_assinantes WHERE criado_em > (UTC_TIMESTAMP() - INTERVAL 10 MINUTE)")->fetchColumn();
  if ($n >= $c['limite_10min']) json(['ok' => false, 'erro' => 'limite'], 429);

  // Limpeza: pendentes com mais de 7 dias saem
  $db->exec("DELETE FROM boreal_assinantes WHERE estado='pendente' AND criado_em < (UTC_TIMESTAMP() - INTERVAL 7 DAY)");

  $st = $db->prepare('SELECT * FROM boreal_assinantes WHERE email = ?');
  $st->execute([$email]);
  $a = $st->fetch();

  $tc = bin2hex(random_bytes(32));
  $tx = bin2hex(random_bytes(32));
  $enviar = false;

  if (!$a) {
    $db->prepare('INSERT INTO boreal_assinantes (email, idioma, estado, token_confirma, token_cancela, consentimento_versao, criado_em, ultimo_envio_confirma) VALUES (?,?,?,?,?,?,?,?)')
       ->execute([$email, $idioma, 'pendente', $tc, $tx, $c['consentimento_versao'], agora(), agora()]);
    $enviar = true;
  } elseif ($a['estado'] === 'ativo') {
    // Já inscrito: não revelamos isso a quem digitou o e-mail, e não reenviamos nada.
  } else {
    // Pendente ou cancelado: só reenviamos se o último envio foi há mais de 10 minutos.
    $ultimo = $a['ultimo_envio_confirma'] ? strtotime($a['ultimo_envio_confirma'] . ' UTC') : 0;
    if (time() - $ultimo > 600) {
      $db->prepare("UPDATE boreal_assinantes SET estado='pendente', idioma=?, token_confirma=?, token_cancela=?, consentimento_versao=?, criado_em=?, ultimo_envio_confirma=?, cancelado_em=NULL WHERE id=?")
         ->execute([$idioma, $tc, $tx, $c['consentimento_versao'], agora(), agora(), $a['id']]);
      $enviar = true;
    }
  }

  if ($enviar) {
    $link = $c['base_url'] . '/confirmar.php?t=' . $tc;
    if ($idioma === 'en') {
      $assunto = 'Confirm your subscription to The Boreal Times';
      $texto = "Hello!\n\nSomeone (hopefully you) asked to receive The Boreal Times newsletter at this address.\n\nTo confirm, open this link:\n$link\n\nIf it was not you, ignore this message and nothing will happen. The request expires in 7 days.\n\nThe Boreal Times\n{$c['site']}/en/\n";
    } elseif ($idioma === 'no') {
      $assunto = 'Bekreft abonnementet ditt på The Boreal Times';
      $texto = "Hei!\n\nNoen (forhåpentligvis du) har bedt om å få nyhetsbrevet fra The Boreal Times til denne adressen.\n\nFor å bekrefte, åpne denne lenken:\n$link\n\nHvis det ikke var deg, kan du se bort fra denne meldingen, så skjer ingenting. Forespørselen utløper om 7 dager.\n\nThe Boreal Times\n{$c['site']}/no/\n";
    } else {
      $assunto = 'Confirme sua inscrição no The Boreal Times';
      $texto = "Olá!\n\nAlguém (esperamos que você) pediu para receber a newsletter do The Boreal Times neste endereço.\n\nPara confirmar, abra este link:\n$link\n\nSe não foi você, ignore esta mensagem e nada acontecerá. O pedido expira em 7 dias.\n\nThe Boreal Times\n{$c['site']}/\n";
    }
    enviar_email($email, $assunto, $texto);
  }
} catch (Throwable $e) {
  error_log('boreal inscrever: ' . $e->getMessage());
  if ($ajax) json(['ok' => false, 'erro' => 'servidor'], 500);
  ir(pagina_site($idioma));
}

sair(true, '', $idioma, $ajax);
