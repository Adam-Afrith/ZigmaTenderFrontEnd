import styles from './PreLoader.module.css';

const PreLoader = (props) => {
return (
    <div className={styles.divPreloader}>
        {props.loading && <div className={styles.loading}>
          <img id="loading_image" className={styles.loading_image} src="/assets/img/282.gif" alt="Loading..." />
        </div>}
        {props.children}
    </div>
)
}

export default PreLoader;