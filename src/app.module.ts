import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { SampleResolver } from './sample/sample.resolver';

@Module({
  imports: [GraphqlModule],
  controllers: [AppController],
  providers: [AppService, SampleResolver],
})
export class AppModule {}
