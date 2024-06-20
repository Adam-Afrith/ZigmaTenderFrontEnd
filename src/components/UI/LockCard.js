import styles from './PreLoader.module.css';

const LockCard = (props) => {
// let text= props.text ? props.text :"";
// let textClass =  props.textClass ? props.textClass :"";
return (
    <div className={styles.divPreloader}>
        {props.locked && <div className={styles.loading}>
          <img id="loading_image" className={`${styles.loading_image} ${styles.fitimage}`} src="/assets/img/lock.png" alt="Locked" /><span className={`${props.textClass}`}> {props.text} </span>
        </div>}
        {props.children}
    </div>
)
}

export default LockCard;