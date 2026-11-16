<?php
// Conta opcional do Álbum de Figurinhas: entrada por link no e-mail (sem senha)
// e sincronização do progresso entre aparelhos.
define('BT', 1);
require __DIR__ . '/comum.php';
cors();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') json(['ok' => false, 'erro' => 'metodo'], 405);

$c = cfg();
$acao = $_POST['acao'] ?? '';
$db = db();
$LINK_MIN = 15; $SESSAO_DIAS = 60; $MAX_BYTES = 30000;

function h($t) { return hash('sha256', $t); }
function mais($seg) { return gmdate('Y-m-d H:i:s', time() + $seg); }
function sessao_conta($db) {
  $t = $_POST['sessao'] ?? '';
  if (!preg_match('/^[a-f0-9]{64}$/', $t)) json(['ok' => false, 'erro' => 'sessao'], 401);
  $st = $db->prepare("SELECT conta_id FROM boreal_album_tokens WHERE hash=? AND tipo='sessao' AND expira_em > ?");
  $st->execute([h($t), agora()]);
  $r = $st->fetch();
  if (!$r) json(['ok' => false, 'erro' => 'sessao'], 401);
  return (int)$r['conta_id'];
}

try {
  $db->prepare("DELETE FROM boreal_album_tokens WHERE expira_em < ?")->execute([agora()]);

  if ($acao === 'entrar') {
    $idioma = limpar_idioma($_POST['idioma'] ?? 'pt');
    $email = strtolower(trim($_POST['email'] ?? ''));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) json(['ok' => false, 'erro' => 'email'], 400);
    if (($_POST['consentimento'] ?? '') !== '1') json(['ok' => false, 'erro' => 'aceite'], 400);
    $ver = $c['consentimento_versao'];
    $st = $db->prepare('SELECT * FROM boreal_album_contas WHERE email=?'); $st->execute([$email]); $a = $st->fetch();
    if (!$a) {
      $db->prepare('INSERT INTO boreal_album_contas (email, idioma, consentimento_versao, criado_em) VALUES (?,?,?,?)')->execute([$email, $idioma, $ver, agora()]);
      $st->execute([$email]); $a = $st->fetch();
    }
    $ultimo = $a['ultimo_link'] ? strtotime($a['ultimo_link'] . ' UTC') : 0;
    if (time() - $ultimo >= 60) { // um link por minuto; quem pede de novo antes recebe o mesmo "ok", sem pista
      $tk = bin2hex(random_bytes(32));
      $db->prepare('INSERT INTO boreal_album_tokens (hash, conta_id, tipo, expira_em) VALUES (?,?,?,?)')->execute([h($tk), $a['id'], 'link', mais($LINK_MIN * 60)]);
      $db->prepare('UPDATE boreal_album_contas SET ultimo_link=?, idioma=? WHERE id=?')->execute([agora(), $idioma, $a['id']]);
      $ap = $c['album_paginas'] ?? ['pt' => '/album/', 'en' => '/en/album/', 'no' => '/no/album/'];
      $pg = $ap[$idioma] ?? $ap['pt'];
      $link = $c['site'] . $pg . '#entrar=' . $tk;
      $T = [
        'pt' => ['Seu link para o Álbum de Figurinhas', "Olá!\n\nAbra este link para entrar no seu Álbum de Figurinhas do Boreal Saga Play. Ele vale por $LINK_MIN minutos e só funciona uma vez:\n\n$link\n\nSe não foi você que pediu, ignore esta mensagem: nada será feito."],
        'en' => ['Your link to the Sticker Album', "Hello!\n\nOpen this link to sign in to your Boreal Saga Play Sticker Album. It is valid for $LINK_MIN minutes and works only once:\n\n$link\n\nIf you did not ask for it, ignore this message: nothing will happen."],
        'no' => ['Lenken din til klistremerkealbumet', "Hei!\n\nÅpne denne lenken for å logge inn på klistremerkealbumet ditt i Boreal Saga Play. Den gjelder i $LINK_MIN minutter og virker bare én gang:\n\n$link\n\nHvis du ikke ba om den, kan du ignorere denne meldingen: ingenting skjer."],
      ][$idioma];
      enviar_email($email, $T[0], $T[1]);
    }
    json(['ok' => true]);
  }

  if ($acao === 'trocar') {
    $t = $_POST['token'] ?? '';
    if (!preg_match('/^[a-f0-9]{64}$/', $t)) json(['ok' => false, 'erro' => 'link'], 400);
    $st = $db->prepare("SELECT conta_id FROM boreal_album_tokens WHERE hash=? AND tipo='link' AND expira_em > ?");
    $st->execute([h($t), agora()]); $r = $st->fetch();
    if (!$r) json(['ok' => false, 'erro' => 'link'], 400);
    $db->prepare('DELETE FROM boreal_album_tokens WHERE hash=?')->execute([h($t)]);
    $s = bin2hex(random_bytes(32));
    $db->prepare('INSERT INTO boreal_album_tokens (hash, conta_id, tipo, expira_em) VALUES (?,?,?,?)')->execute([h($s), $r['conta_id'], 'sessao', mais($SESSAO_DIAS * 86400)]);
    $e = $db->prepare('SELECT email FROM boreal_album_contas WHERE id=?'); $e->execute([$r['conta_id']]);
    json(['ok' => true, 'sessao' => $s, 'email' => $e->fetchColumn()]);
  }

  $id = sessao_conta($db);

  if ($acao === 'obter') {
    $st = $db->prepare('SELECT dados FROM boreal_album_progresso WHERE conta_id=?'); $st->execute([$id]);
    $d = $st->fetchColumn();
    json(['ok' => true, 'dados' => $d ? json_decode($d, true) : null]);
  }

  if ($acao === 'salvar') {
    $raw = $_POST['dados'] ?? '';
    if (strlen($raw) > $MAX_BYTES) json(['ok' => false, 'erro' => 'grande'], 413);
    $d = json_decode($raw, true);
    if (!is_array($d) || ($d['app'] ?? '') !== 'boreal-album') json(['ok' => false, 'erro' => 'dados'], 400);
    $limpo = ['app' => 'boreal-album', 'v' => 1];
    foreach (['stuck', 'bag', 'won'] as $k) {
      $limpo[$k] = [];
      foreach ((array)($d[$k] ?? []) as $x) if (is_string($x) && strlen($x) <= 120 && preg_match('/^[A-Za-z0-9_\-.]+$/', $x)) $limpo[$k][] = $x;
    }
    foreach (['dpk', 'wpk', 'ember', 'opened'] as $k) $limpo[$k] = max(0, min(99999, (int)($d[$k] ?? 0)));
    $limpo['day'] = preg_match('/^\d{4}-\d{2}-\d{2}$/', $d['day'] ?? '') ? $d['day'] : '';
    $js = json_encode($limpo);
    $st = $db->prepare('SELECT 1 FROM boreal_album_progresso WHERE conta_id=?'); $st->execute([$id]);
    if ($st->fetch()) $db->prepare('UPDATE boreal_album_progresso SET dados=?, atualizado_em=? WHERE conta_id=?')->execute([$js, agora(), $id]);
    else $db->prepare('INSERT INTO boreal_album_progresso (conta_id, dados, atualizado_em) VALUES (?,?,?)')->execute([$id, $js, agora()]);
    json(['ok' => true]);
  }

  if ($acao === 'sair') {
    $db->prepare('DELETE FROM boreal_album_tokens WHERE hash=?')->execute([h($_POST['sessao'])]);
    json(['ok' => true]);
  }

  if ($acao === 'apagar') { // direito de apagar (LGPD/GDPR): some tudo da conta
    $db->prepare('DELETE FROM boreal_album_progresso WHERE conta_id=?')->execute([$id]);
    $db->prepare('DELETE FROM boreal_album_tokens WHERE conta_id=?')->execute([$id]);
    $db->prepare('DELETE FROM boreal_album_contas WHERE id=?')->execute([$id]);
    json(['ok' => true]);
  }

  json(['ok' => false, 'erro' => 'acao'], 400);
} catch (Throwable $e) {
  error_log('album.php: ' . $e->getMessage());
  json(['ok' => false, 'erro' => 'servidor'], 500);
}
