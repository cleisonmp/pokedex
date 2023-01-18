import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700;900&family=Sriracha&display=swap'
          rel='stylesheet'
        />

        <link rel='shortcut icon' href='/favicon.ico' type='image/ico' />
      </Head>
      <body className='bg-gray-700 text-gray-50'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
