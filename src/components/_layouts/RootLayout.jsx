import Head from 'next/head';
import Navbar from "../Navbar";

// Bug requires 1px height for children to be 100% - https://stackoverflow.com/questions/8468066/child-inside-parent-with-min-height-100-not-inheriting-height
const mainStyle = { height: "1px", minHeight: "50vh" }; 

export default function RootLayout({ children }) {
  return (
    <div>
      <Head>
        <title>Pay2Vote</title>
        <meta name="description" content="DApp for users to pay Test Ether to vote and highest voter takes all" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main style={mainStyle}>
        {children}
      </main>
      <footer>
      </footer>
    </div>
  )
}