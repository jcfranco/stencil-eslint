import { Rule } from 'eslint';
import ts from 'typescript';
import { getDecorator } from '../utils';
import * as tsutils from 'tsutils';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "This rule catches Stencil Prop names that share names of Global HTML Attributes.",
      category: "Possible Errors",
      recommended: true
    },
    schema: []
  },

  create(context): Rule.RuleListener {

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    const parserServices = context.parserServices;
    const typeChecker = parserServices.program.getTypeChecker() as ts.TypeChecker;
    return {
      'MethodDefinition': (node: any) => {
        if (getDecorator(node, 'Method')) {
          const method = parserServices.esTreeNodeToTSNodeMap.get(node);
          const signature = typeChecker.getSignatureFromDeclaration(method);
          const returnType = typeChecker.getReturnTypeOfSignature(signature!);
          if (!tsutils.isThenableType(typeChecker, method, returnType)) {
            context.report({
              node: node.key,
              message: `External @Method() ${node.key.name}() must return a Promise. Consider prefixing the method with async, such as @Method async ${node.key.name}().`
            });
          }
        }
      }
    };
  }
};

export default rule;