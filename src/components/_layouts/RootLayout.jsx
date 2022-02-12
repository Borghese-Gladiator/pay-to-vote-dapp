import Head from 'next/head';
import Navbar from "../Navbar";
import { aboutText } from "../../utils";

// Bug requires 1px height for children to be 100% - https://stackoverflow.com/questions/8468066/child-inside-parent-with-min-height-100-not-inheriting-height
const mainStyle = { height: "1px", minHeight: "50vh" }; 

export default function RootLayout({ children }) {
  return (
    <div>
      <Head>
        <title>Money Auction</title>
        <meta name="description" content={aboutText} />
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