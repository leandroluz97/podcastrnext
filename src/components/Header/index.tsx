import styles from "./styles.module.scss"

import format from "date-fns/format"
import ptBR from "date-fns/locale/pt-BR"

const Header = () => {
  const currentdate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  })
  return (
    <header className={styles.headerContainer}>
      <img src='/logo.svg' alt='Podcastr'></img>

      <p>O melhor para você ouvir, sempre.</p>

      <span>{currentdate}</span>
    </header>
  )
}

export default Header
