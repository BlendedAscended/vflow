import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { testimonialType } from './testimonialType'
import { serviceType } from './serviceType'
import { faqType } from './faqType'
import { blogType } from './blogType'
import { contactType } from './contactType'
import { chatLogType } from './chatLogType'
import { systemContextType } from './systemContextType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, testimonialType, serviceType, faqType, blogType, contactType, chatLogType, systemContextType],
}
