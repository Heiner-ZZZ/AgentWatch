import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAgentKey = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.agentKey as { agentId: string; organizationId: string } | undefined;
  },
);
