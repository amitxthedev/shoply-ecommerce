/**
 * Conditional class-name joiner — keeps component class lists readable
 * without pulling in a dependency.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
