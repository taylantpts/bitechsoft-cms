/** Client-safe props — no Payload server imports. */

export type ServiceCard = {
  id: number
  baslik: string
  ikon: string
  aciklama: string
}

export type PortfolioCard = {
  id: number
  baslik: string
  kategori: string
  canliLink?: string | null
  imageUrl: string | null
}

export type NavLink = {
  id?: string | null
  label: string
  url: string
}

export type HeaderData = {
  navLinks?: NavLink[] | null
}

export type FooterLink = {
  id?: string | null
  label: string
  url: string
}

export type FooterColumn = {
  id?: string | null
  title: string
  links?: FooterLink[] | null
}

export type FooterData = {
  copyright: string
  socialLinks?: FooterLink[] | null
  columns?: FooterColumn[] | null
}
