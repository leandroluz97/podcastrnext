import { useEffect } from "react"
import Header from "../components/Header"
import { GetStaticProps } from "next"
import { api } from "../services/api"
import Image from "next/image"

import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

import styles from "./home.module.scss"

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: string
  description: string
  url: string
}
type HomeProps = {
  allEpisodes: Episode[]
  latestEpisodes: Episode[]
}

export default function Home({ allEpisodes, latestEpisodes }: HomeProps) {
  /*
  ---SPA----
  useEffect(() => {
    fetch(`http://localhost:3333/episodes`)
      .then((response) => response.json())
      .then((data) => console.log(data))
  }, [])
  */

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode) => (
            <li key={episode.id}>
              <div className={styles.imageBox}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit='cover'
                />
              </div>

              <div className={styles.episodeDetails}>
                <a href=''>{episode.title}</a>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type='button'>
                <img src='/play-green.svg' alt='tocar eepisodio' />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.allEpisodes}></section>
    </div>
  )
}

// ---SSR ---getServerSideProps
//SSG
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get(`episodes`, {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  })

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      description: episode.description,
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2)

  return {
    props: {
      allEpisodes,
      latestEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
