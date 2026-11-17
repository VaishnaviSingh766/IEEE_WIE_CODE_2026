import { Link } from 'react-router-dom'

const css = `
  .btn-fill {
    cursor: pointer;
    --c: #C21891;
    --hover-text: #fff;
    display: inline-block;
    box-sizing: border-box;
    padding: 12px 28px;
    margin: 0;
    position: relative;
    min-width: 12em;
    background: transparent;
    font-size: 15px;
    font-weight: 900;
    color: var(--c);
    text-align: center;
    text-transform: uppercase;
    text-decoration: none;
    font-family: inherit;
    letter-spacing: 0.1em;
    border: 2px solid var(--c);
    border-radius: 8px;
    overflow: hidden;
    z-index: 1;
    transition: 0.5s;
    pointer-events: auto;
  }
  @media (min-width: 640px) { .btn-fill { font-size: 17px; } }
  @media (min-width: 1024px) { .btn-fill { font-size: 19px; } }

  .btn-fill span {
    position: absolute;
    width: 25%;
    height: 100%;
    background-color: var(--c);
    transform: translateY(150%);
    border-radius: 50%;
    left: calc((var(--n) - 1) * 25%);
    transition: 0.5s;
    transition-delay: calc((var(--n) - 1) * 0.1s);
    z-index: -1;
  }
  .btn-fill:hover { color: var(--hover-text); }
  .btn-fill:hover span { transform: translateY(0) scale(2); }

  .btn-fill span:nth-child(1) { --n: 1; }
  .btn-fill span:nth-child(2) { --n: 2; }
  .btn-fill span:nth-child(3) { --n: 3; }
  .btn-fill span:nth-child(4) { --n: 4; }
`

export default function Button({ children, to, href, color, className = '', style, ...props }) {
  const Tag = to ? Link : href ? 'a' : 'button'
  const extra = to ? { to } : href ? { href } : { type: 'button' }

  return (
    <>
      <style>{css}</style>
      <Tag
        {...extra}
        {...props}
        className={`btn-fill ${className}`}
        style={color ? { '--c': color, ...style } : style}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        {children}
      </Tag>
    </>
  )
}
  