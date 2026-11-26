<?php
// Copie este arquivo para config.php e preencha. NUNCA suba config.php para o Git.
return [
  // Banco criado no painel do Domeneshop para o Boreal Saga Play
  'db_host' => 'NOME_DO_BANCO.mysql.domeneshop.no',
  'db_nome' => 'NOME_DO_BANCO',
  'db_user' => 'USUARIO',
  'db_senha' => 'SENHA',

  // Remetente. Use um endereço de um domínio que o Domeneshop envia (veja LEIA-ME.md)
  'de_email' => 'post@borealsagaplay.com',
  'de_nome' => 'Boreal Saga Play',
  'responder_para' => 'post@borealsagaplay.com',

  // Onde este script está publicado (sem barra no fim) e onde fica o site
  'base_url' => 'https://api.dsnorge.com/boreal',
  'site' => 'https://borealsagaplay.com',
  'paginas' => ['pt' => '/pt/assinatura/', 'en' => '/subscribe/', 'no' => '/no/abonner/', 'es' => '/es/suscripcion/'],

  // Página do álbum em cada idioma (para o link do e-mail)
  'album_paginas' => ['pt' => '/pt/album/', 'en' => '/album/', 'no' => '/no/album/', 'es' => '/es/album/'],

  // Quem pode chamar o formulário
  'origens' => ['https://borealsagaplay.com', 'https://www.borealsagaplay.com'],

  // Versão do texto de consentimento mostrado no site (mude quando o texto mudar)
  'consentimento_versao' => '2026-11-13',

  // Máximo de inscrições novas aceitas a cada 10 minutos (freio contra abuso)
  'limite_10min' => 60,

  // Senha para rodar enviar.php pelo terminal (Unix shell). Troque por algo longo.
  'segredo' => 'TROQUE-ISTO',
];
