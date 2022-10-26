import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { Form_new } from '../components/form_new'
const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Form_new></Form_new>
    </div>
  )
}

export default Home
