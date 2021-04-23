import { useEffect } from "react"
import Header from "../components/Header"

export default function Home(props) {
  console.log(props.episodes)

  /*
  ---SPA----
  useEffect(() => {
    fetch(`http://localhost:3333/episodes`)
      .then((response) => response.json())
      .then((data) => console.log(data))
  }, [])
  */
  return (
    <>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </>
  )
}

// ---SSR ---getServerSideProps
//SSG
export async function getStaticProps() {
  const response = await fetch(`http://localhost:3333/episodes`)
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidade: 60 * 60 * 8,
  }
}
