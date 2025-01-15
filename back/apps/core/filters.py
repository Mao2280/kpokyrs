from rest_framework import filters


class FilterBackend(filters.BaseFilterBackend):

    def filter_queryset(self, request, queryset, view):
        order_by = offset = limit = None
        query_params = dict(request.query_params)
        for field, value in query_params.items():
            # order by
            if field == '__order_by':
                order_by = [x for x in query_params.get('__order_by')[0].split(',')]
            elif field == '__limit':
                limit = query_params.get('__limit')
            elif field == '__offset':
                offset = query_params.get('__offset')
            elif field in ['__relations', '__fields', '__omit', ]:
                # игнорируйте, это обрабатывается drf-flex-fields
                continue
            else:
                value = value[0]
                if field.endswith('__in'):
                    value = value.split(',')
                else:
                    if value == 'true':
                        value = True
                    if value == 'false':
                        value = False
                queryset = queryset.filter(**{field:value})

        if order_by:
            queryset = queryset.order_by(*order_by)
        if limit is not None and offset is not None:
            queryset = queryset[int(offset[0]):int(offset[0])+int(limit[0])]
        elif offset is not None and limit is None:
            queryset = queryset[int(offset[0]):]
        elif limit is not None and offset is None:
            queryset = queryset[:int(limit[0])]

        return queryset
