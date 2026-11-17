export default function Heading({ children, as: Tag = "h2", ...props }) {
  return <Tag {...props}>{children}</Tag>;
}
