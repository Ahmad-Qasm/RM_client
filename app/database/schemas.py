from app import ma

class OrderSchema(ma.Schema):
    class Meta:
        # Tuple with fields to include in the serialized result
        fields = (
            'id',
            'creator',
            'project',
            'system',
            'sopSocop',
            'typeOfRelease',
            'status',
            'bswVersion',
            'relMeetingWeek',
            'filesOnServerWeek',
            'projectMeco',
            'projectAccountNumber',
            'delOrderADate',
            'delOrderAComment',
            'delOrderBDate',
            'delOrderBComment',
            'delOrderCDate',
            'delOrderCComment',
            'delOrderDDate',
            'delOrderDComment',
            'delOrderEDate',
            'delOrderEComment',
            'delOrderFDate',
            'delOrderFComment',
            'state',
            'customer',
            'date_created',
            'engines',
            'storyLink'
        )

class OrderIdSchema(ma.Schema):
    class Meta:
        fields = (
            'id',
        )

class ProjectSchema(ma.Schema):
    class Meta:
        fields = ('name', 'id', 'project_responsible', 'system')

class GroupSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name','reviewer','approver')

# Taskid is a fixed id needed for the automatic date calculation to work in frontend.
class TaskSchema(ma.Schema):
    class Meta:
        fields = ('name', 'id', 'originalEstimate', 'description', 'taskid')

class TaskdateSchema(ma.Schema):
    class Meta:
        fields = ('id', 'task', 'date', 'timeEstimate')

class OrderTaskSchema(ma.Schema):
    tasks = ma.Nested(TaskSchema, many=True)
    class Meta:
        fields = (
            'id',
            'creator',
            'project',
            'system',
            'sopSocop',
            'typeOfRelease',
            'status',
            'bswVersion',
            'relMeetingWeek',
            'filesOnServerWeek',
            'projectMeco',
            'projectAccountNumber',
            'delOrderADate',
            'delOrderAComment',
            'delOrderBDate',
            'delOrderBComment',
            'delOrderCDate',
            'delOrderCComment',
            'delOrderDDate',
            'delOrderDComment',
            'delOrderEDate',
            'delOrderEComment',
            'delOrderFDate',
            'delOrderFComment',
            'state',
            'customer',
            'tasks',
            'date_created'
        )

class OrderTaskdateSchema(ma.Schema):
    tasks = ma.Nested(TaskSchema, many=True)
    class Meta:
        fields = (
            'id',
            'creator',
            'project',
            'system',
            'sopSocop',
            'typeOfRelease',
            'status',
            'bswVersion',
            'relMeetingWeek',
            'filesOnServerWeek',
            'projectMeco',
            'projectAccountNumber',
            'delOrderADate',
            'delOrderAComment',
            'delOrderBDate',
            'delOrderBComment',
            'delOrderCDate',
            'delOrderCComment',
            'delOrderDDate',
            'delOrderDComment',
            'delOrderEDate',
            'delOrderEComment',
            'delOrderFDate',
            'delOrderFComment',
            'state',
            'customer',
            'taskdates',
            'date_created'
        )

class TaskOrderSchema(ma.Schema):
    orders = ma.Nested(OrderSchema,many=True)
    class Meta:
        fields = ('name', 'originalEstimate',
                  'orders')

class TaskdateOrderSchema(ma.Schema):
    orders = ma.Nested(OrderSchema,many=True)
    class Meta:
        fields = ('task', 'date', 'timeEstimate',
                  'orders')

# Initialize objects to be used in other files
order_schema = OrderSchema()
multi_order_schema = OrderSchema(many=True)

multi_order_id_schema = OrderIdSchema(many=True)

multi_group_schema = GroupSchema(many=True)
group_schema = GroupSchema()

project_schema = ProjectSchema()
multi_project_schema = ProjectSchema(many=True)

multi_task_schema = TaskSchema(many=True)
task_schema = TaskSchema()

multi_taskdate_schema = TaskdateSchema(many=True)
taskdate_schema = TaskdateSchema()