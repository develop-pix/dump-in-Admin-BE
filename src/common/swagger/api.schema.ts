interface ResponseProps {
  status: number;
  message: string;
  success: boolean;
  data?: Record<string, unknown>;
}

export const createSchema = ({
  status,
  message,
  success,
  data,
}: ResponseProps) => ({
  properties: {
    code: { enum: [status] },
    message: {
      type: 'string',
      example: message,
    },
    success: { type: 'boolean', example: success },
    data: data ?? { type: 'object' },
  },
});
