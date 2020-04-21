import styles from './header.module.css'

const Header = () => (
    <div class={styles.container}>
        <img src="/logo.png" /><br />
        <h3>Automatically syncs your videos and subtitles!</h3>
    </div>
)

export default Header