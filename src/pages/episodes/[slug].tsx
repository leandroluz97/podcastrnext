import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import { GetStaticProps, GetStaticPaths } from "next"
import { useRouter } from "next/router"
import { api } from "../../services/api"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"
import ptBR from "date-fns/locale/pt-BR"
import styles from "./episode.module.scss"
import Image from "next/image"
import Link from "next/link"

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

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  const router = useRouter()
  return (
    <div className={styles.EpisodeWrapper}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href='/'>
            <button type='button'>
              <img src='/arrow-left.svg' alt='voltar' />
            </button>
          </Link>
          <Image
            width={700}
            height={160}
            src={episode.thumbnail}
            objectFit='cover'
          />
          <button type='button'>
            <img src='/play.svg' alt='voltar' />
          </button>
        </div>
        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </div>
  )
}

//for dynamics page
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params

  const { data } = await api.get(`episodes/${slug}`)

  const episode: Episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    description: data.description,
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24horas
  }
}
