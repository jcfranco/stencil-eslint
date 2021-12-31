import { Rule } from 'eslint';
// @ts-ignore
import { getDecorator, parseDecorator, stencilComponentContext } from 'stencil-eslint-core';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'This rule catches usages of events using @Listen decorator.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    type: 'problem'
  },

  create(context): Rule.RuleListener {
    const stencil = stencilComponentContext();
    return {
      ...stencil.rules,
      'MethodDefinition[kind=method]': (node: any) => {
        if (!stencil.isComponent()) {
          return;
        }
        const listenDec = getDecorator(node, 'Listen');
        if (listenDec) {
          const [eventName, opts] = parseDecorator(listenDec);
          if (typeof eventName === 'string' && opts === undefined) {
            const eventName = listenDec.expression.arguments[0].value;
            if (PREFER_VDOM_LISTENER.includes(eventName)) {
              context.report({
                node: listenDec,
                message: `Use vDOM listener instead.`
              });
            }
          }
        }
      }
    };
  }
};

const PREFER_VDOM_LISTENER = [
  'click',
  'touchstart',
  'touchend',
  'touchmove',
  'mousedown',
  'mouseup',
  'mousemove',
  'keyup',
  'keydown',
  'focusin',
  'focusout',
  'focus',
  'blur'
];

export default rule;
