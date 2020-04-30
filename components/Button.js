import styles from './Button.module.css'

export default React.forwardRef(({ onClick, href, name }, ref) => {
  return (
    <a className={styles.button} href={href} onClick={onClick} ref={ref}>
      {name}
    </a>
  )
})
