# Desafio de Automação de Testes Mobile

Requisito: Utilizando o aplicativo native-demo-app do WebDriverIO, desenvolver uma automação que cubra as principais funcionalidades do app: Login/Cadastro, Navegação entre telas, Preenchimento de formulários e Verificação de mensagens de erro. O projeto utiliza **JavaScript** (ES modules), padrão Page Object, relatórios Allure e integração com CI/CD.

## Configuração do ambiente

- **Node.js** 18 ou superior (recomendado 20)
- **npm** 9 ou superior
- **Appium** 3.x (instalado globalmente ou via `@wdio/appium-service`)
- **Android SDK** (para emulador Android). Defina `ANDROID_HOME` ou `ANDROID_SDK_ROOT` apontando para o diretório do SDK. No macOS com Android Studio, o caminho padrão é `~/Library/Android/sdk`. Os scripts `npm test` e `npm run android.app` usam esse caminho automaticamente se a variável não estiver definida. 

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repositorio>
cd desafio-automacao-de-testes-mobile-carrefour
npm install
```

Baixe os apps do native-demo-app em https://github.com/webdriverio/native-demo-app/releases e coloque na pasta `apps/`:

- **Android**: `android.wdio.native.app.v2.0.0.apk`
- **iOS**: `ios.simulator.wdio.native.app.v2.0.0.zip`

Ajuste o nome do arquivo em `config/wdio.android.app.conf.js` e `config/wdio.ios.app.conf.js` se usar outra versão. Ajuste também `deviceName` e `platformVersion` conforme o emulador/simulador configurado localmente.

## Como rodar os testes

```bash
npm test
```

Por padrão executa no Android. Para escolher a plataforma:

```bash
npm run android.app
npm run ios.app
```

## Relatórios

Após a execução, os resultados do Allure ficam em `reports/allure-results/`. Para gerar e abrir o relatório:

```bash
npm run report
```

O relatório inclui resumo dos testes, screenshots das falhas, logs e informações do ambiente. Screenshots são capturados automaticamente em caso de falha.

## Testes implementados

Os cenários cobrem Login, Cadastro, Navegação e Formulários do native-demo-app, com validação de mensagens de erro.

| # | Área | Descrição |
|---|------|-----------|
| 01 | Login | Login com credenciais válidas |
| 02 | Login | Login com credenciais inválidas e verificação de mensagem de erro |
| 03 | Cadastro | Cadastro com dados válidos |
| 04 | Cadastro | Cadastro com confirmação de senha diferente e verificação de mensagem de erro |
| 05 | Navegação | Navegação entre tabs (Home, WebView, Login, Forms, Swipe, Drag) |
| 06 | Navegação | Acesso à tela Forms via tab bar |
| 07 | Formulários | Preenchimento do formulário com input, switch e dropdown |
| 08 | Formulários | Validação de campo obrigatório (botão inativo não dispara alerta) |
| 09 | Formulários | Submissão do formulário e verificação de feedback (botão ativo) |
| 10 | Mensagens | Verificação de mensagem de erro em login com campos vazios |

Há ainda um spec opcional `login.data-driven.spec.js` que executa login com dados do arquivo `tests/data/login.json` (data-driven).

## CI

O workflow em `.github/workflows/ci.yml` roda em todo push e em pull requests: instala dependências com `npm ci`, baixa o APK do native-demo-app, inicia um emulador Android (via reactivecircus/android-emulator-runner), executa `npm test` e publica a pasta `reports/` como artefato. Em caso de falha em qualquer teste, o pipeline falha.

## Estrutura do projeto

```
desafio-automacao-de-testes-mobile-carrefour/
  config/
    wdio.shared.conf.js              # config base (Mocha, Allure, screenshots)
    wdio.shared.local.appium.conf.js
    wdio.android.app.conf.js        # Android
    wdio.ios.app.conf.js             # iOS
  tests/
    pageobjects/
      AppScreen.js, LoginPage.js, FormsPage.js, TabBar.js, HomePage.js
      NativeAlert.js, Picker.js
    specs/
      login.spec.js, cadastro.spec.js, navigation.spec.js, forms.spec.js
      login.data-driven.spec.js
    data/
      login.json                     # dados para data-driven
  apps/                              # APK e .zip do native-demo-app
  .github/workflows/
    ci.yml                           # pipeline de testes
  reports/                           # allure-results, allure-report
  package.json
  README.md
```
