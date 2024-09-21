import { Module, Global, DynamicModule } from '@nestjs/common';
import { ElasticAPMOptions, ElasticAPMService } from './elastic-apm.service';

@Global()
@Module({
  providers: [ElasticAPMService],
  exports: [ElasticAPMService],
})
export class ElasticAPMModule {
  static forRoot(options: ElasticAPMOptions): DynamicModule {
    return {
      module: ElasticAPMModule,
      providers: [
        {
          provide: ElasticAPMService,
          useFactory: () => {
            const elasticApmService = new ElasticAPMService();
            elasticApmService.initialize(options);
            return elasticApmService;
          },
        },
      ],
      exports: [ElasticAPMService],
    };
  }
}