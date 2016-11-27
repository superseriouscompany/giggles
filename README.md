# steffigraffiti

The superserious october project

## Installation

https://facebook.github.io/react-native/docs/getting-started.html


## Running

    # iOS
    $ open ios/steffigraffiti.xcodeproj

    # Android
    Run android studio, open android folder

    # Server
    $ cd server
    $ npm run dev

## Managing pushes (from http://docs.aws.amazon.com/sns/latest/dg/mobile-push-apns.html)

   1. Export .cer file as .p12 file (already done in `ios/certs`)
   2. Convert binary .p12 file to plaintext .pem file (already done in `ios/certs`)
   3. Upload .p12 file to SNS create application dialog
   4. Manually copy certificate from .pem file and paste into SNS dialog
   5. Manually copy private key from .pem file and paste into SNS dialog
