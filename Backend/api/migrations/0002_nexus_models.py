from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [

        # 1. Crear Usuario
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id_usuario', models.AutoField(primary_key=True, serialize=False)),
                ('nombre',     models.CharField(max_length=100)),
                ('apellido',   models.CharField(max_length=100)),
                ('email',      models.EmailField(unique=True)),
                ('password',   models.CharField(max_length=255)),
                ('rol',        models.CharField(
                    choices=[
                        ('vendedor',       'Vendedor'),
                        ('comprador',      'Comprador'),
                        ('administrador',  'Administrador'),
                    ],
                    default='comprador',
                    max_length=20,
                )),
            ],
            options={'db_table': 'usuario'},
        ),

        # 2. Reemplazar Producto original con el nuevo (FK a Usuario)
        migrations.DeleteModel(name='Producto'),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id_producto', models.AutoField(primary_key=True, serialize=False)),
                ('nombre',      models.CharField(max_length=200)),
                ('descripcion', models.TextField(blank=True, null=True)),
                ('precio',      models.DecimalField(decimal_places=2, max_digits=10)),
                ('stock',       models.PositiveIntegerField(default=0)),
                ('id_usuario',  models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='productos',
                    to='api.usuario',
                    db_column='id_usuario',
                )),
            ],
            options={'db_table': 'producto'},
        ),

        # 3. Crear Carrito
        migrations.CreateModel(
            name='Carrito',
            fields=[
                ('id_carrito', models.AutoField(primary_key=True, serialize=False)),
                ('estado',     models.CharField(
                    choices=[
                        ('activo',     'Activo'),
                        ('pendiente',  'Pendiente'),
                        ('abandonado', 'Abandonado'),
                    ],
                    default='activo',
                    max_length=20,
                )),
                ('id_usuario', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='carritos',
                    to='api.usuario',
                    db_column='id_usuario',
                )),
            ],
            options={'db_table': 'carrito'},
        ),

        # 4. Crear DetalleCarrito
        migrations.CreateModel(
            name='DetalleCarrito',
            fields=[
                ('id_item',    models.AutoField(primary_key=True, serialize=False)),
                ('cantidad',   models.PositiveIntegerField()),
                ('id_carrito', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='detalles',
                    to='api.carrito',
                    db_column='id_carrito',
                )),
                ('id_producto', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='detalles_carrito',
                    to='api.producto',
                    db_column='id_producto',
                )),
            ],
            options={
                'db_table': 'detalle_carrito',
                'unique_together': {('id_carrito', 'id_producto')},
            },
        ),

        # 5. Crear OrdenCompra
        migrations.CreateModel(
            name='OrdenCompra',
            fields=[
                ('id_orden',   models.AutoField(primary_key=True, serialize=False)),
                ('fecha',      models.DateTimeField(auto_now_add=True)),
                ('total',      models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('id_usuario', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='ordenes',
                    to='api.usuario',
                    db_column='id_usuario',
                )),
            ],
            options={'db_table': 'orden_compra'},
        ),

        # 6. Crear DetalleOrden
        migrations.CreateModel(
            name='DetalleOrden',
            fields=[
                ('id_detalle',       models.AutoField(primary_key=True, serialize=False)),
                ('cantidad',         models.PositiveIntegerField()),
                ('precio_unitario',  models.DecimalField(decimal_places=2, max_digits=10)),
                ('id_orden', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='detalles',
                    to='api.ordencompra',
                    db_column='id_orden',
                )),
                ('id_producto', models.ForeignKey(
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='detalles_orden',
                    to='api.producto',
                    db_column='id_producto',
                )),
            ],
            options={'db_table': 'detalle_orden'},
        ),
    ]