import styles from './navbar.module.css'
import Grid from '@material-ui/core/Grid'
import { useRouter } from 'next/router'
import Hidden from '@material-ui/core/Hidden'
import {useState} from 'react'


const MobileNavbar = () => {
    const router = useRouter()
    const [navbarOpen, setNavbarOpen] = useState(false)

    const handleChangeNavbarVisibility = () => {
        setNavbarOpen(!navbarOpen)
        console.log(navbarOpen)
    }

    return (
    <div>
        <Grid container className={styles.mobileNavbar}>
            <Grid item xs={1} onClick={handleChangeNavbarVisibility}>
                <img src="/burger.svg" className={styles.burger}/>
            </Grid>
            <Grid item xs={11}>
                <object type="image/svg+xml" data="/logo.svg" className={styles.mobileLogo} />
            </Grid>          
        </Grid>
        {
        navbarOpen && (
        <div  className={styles.mobileMenu}>
            {
                router.pathname !== "/" && 
                <div className={styles.mobileNavbarItem}><a href="/">Sync</a><br /></div>
            }
            {
                router.pathname !== "/about" && 
                <div className={styles.mobileNavbarItem}><a href="/about">About</a><br /></div>
            }
            {
                router.pathname !== "/contact" && 
                <div className={styles.mobileNavbarItem}><a href="/contact">Contact</a><br /></div>
            }
        </div>
        )
        }
    </div>
    )
}

const DesktopNavbar = () => {
    const router = useRouter()
    return (
    <Grid container className={styles.navbar}>
        <Grid item md={4}>
            <a href="/">
                <img src="/logo.svg" />
            </a>
        </Grid> 
        <Grid item md={1} className={styles.navbarItem}>
            <a href="/" className={(router.pathname !== "/sync" && router.pathname !== "/") ? styles.inactive : styles.active}>
                Sync
            </a>
        </Grid>   
        <Grid item md={2}className={styles.navbarItem}>
            <a href="/about" className={router.pathname !== "/about" ? styles.inactive : styles.active}>
                About
            </a>
        </Grid>   
        <Grid item md={1} className={styles.navbarItem}>
            <a href="/contact" className={router.pathname !== "/contact" ? styles.inactive : styles.active}>
                Contact
            </a>
        </Grid>           
    </Grid>
    )
}

const Navbar = () => {
    return (
    <div>
        <Hidden only={["xs", "sm"]}>
            <DesktopNavbar />
        </Hidden>
        <Hidden only={["md", "lg", "xl"]}>
            <MobileNavbar />
        </Hidden>
    </div>
    )
}
    

export default Navbar