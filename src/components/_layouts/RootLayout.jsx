import Head from 'next/head';
import Navbar from "../Navbar";

export default function RootLayout({ children }) {
  return (
    <div>
      <Head>
        <title>Pay2Vote</title>
        <meta name="description" content="DApp for users to pay Test Ether to vote and highest voter takes all" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ height: "80vh" }}>
        <Navbar />
        {children}
      </main>
      <footer>
      </footer>
    </div>
  )
}