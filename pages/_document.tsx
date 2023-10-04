/* eslint-disable @next/next/no-sync-scripts */
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script src="html2pdf.bundle.min.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>

    </Html>
  )
}
