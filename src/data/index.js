// Единая точка входа для контента: отдаёт данные того языка, под который
// собрана сборка. Компоненты импортируют отсюда и о языке не знают.
import { lang } from '../i18n'

import articlesRu from './articles'
import articlesEn from './articles.en'
import { products as productsRu } from './products'
import { products as productsEn } from './products.en'
import { cases as casesRu } from './cases'
import { cases as casesEn } from './cases.en'

export const articles = lang === 'en' ? articlesEn : articlesRu
export const products = lang === 'en' ? productsEn : productsRu
export const cases = lang === 'en' ? casesEn : casesRu
