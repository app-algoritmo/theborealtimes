# Conta opcional do Álbum de Figurinhas

O Álbum funciona sem conta: o progresso fica no navegador de cada aparelho. A conta é opcional e serve para levar o álbum a outros aparelhos. Enquanto o bloco `album:` não existir no `boreal.yaml`, o site não mostra nada disso.

## Para ligar

1. No phpMyAdmin do Domeneshop, rode o conteúdo de `banco-album.sql` (cria 3 tabelas novas; não mexe em `boreal_assinantes`).
2. Envie `album.php` e o `comum.php` atualizado para a mesma pasta dos outros PHP.
3. No `config.php`, acrescente (opcional, só se a página do álbum mudar de endereço):
   `'album_paginas' => ['pt' => '/pt/album/', 'en' => '/album/', 'no' => '/no/album/'],`
4. No `boreal.yaml`, acrescente no fim do arquivo:

```yaml
album:
  api: "https://api.dsnorge.com/boreal"
```

5. Rode `publicar.py construir` e publique.

## O que é guardado

E-mail, idioma, versão do consentimento, progresso do álbum (lista de figurinhas, jogos vencidos, pacotes e brasas) e códigos de acesso em forma de hash (SHA-256). O link do e-mail vale 15 minutos e funciona uma vez; a sessão dura 60 dias. A pessoa pode sair e apagar conta e dados pelo próprio Álbum.

## Antes de ligar: página de privacidade

A página de privacidade ainda não descreve esta conta. Ela precisa de um parágrafo (controlador, e-mail e progresso guardados, finalidade de sincronizar, base legal = consentimento, prazo = até a pessoa apagar, direito de apagar pelo Álbum). Quem decide o texto é o editor responsável.
