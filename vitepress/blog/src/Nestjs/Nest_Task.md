# Task

> 在有些场景，我们需要定时去做某个事情，或者安装计划每一段时间做某个事情，那么就需要通过任务调度来实现。

## @nestjs/schedule

``` ts
// 1、安装依赖
pnpm add @nestjs/schedule
// 2、在 app.module.ts 导入 ScheduleModule ， 返回的是一个 global module
imports: [
    ScheduleModule.forRoot()
]
// 3、home.schedule.ts
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class HomeSchedule {
  private readonly logger = new Logger(HomeSchedule.name);

  @Interval(5000)
  handleInterval() {
    this.logger.log('interval 5s task schedule');
  }
}
// 4、home.module.ts
providers: [
    HomeSchedule,
]
```

**注意：不能定义在 controller 中，只能定义在 provider 中** 

## `Interval`  && `Timeout`  任务

通过 `@Interval` , `@Timeout` 来创建任务 ， 也可以通过 `SchedulerRegistry` 提供的 api 来动态创建任务 

```ts
// home.schedule.ts
import { Injectable, Logger } from '@nestjs/common';
import { Interval, Timeout, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class HomeSchedule {
  private readonly logger = new Logger(HomeSchedule.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.schedulerRegistry.addInterval(
      'customInterval',
      setInterval(() => {
        this.logger.log('customInterval 4s task schedule');
      }, 4000),
    );

    this.schedulerRegistry.addTimeout(
      'customTimeout',
      setTimeout(() => {
        this.schedulerRegistry.deleteInterval('customInterval');
        this.logger.log('customTimeout task trigger , stop customInterval');
      }, 20000),
    );
  }

  @Interval('intervalTask', 5000)
  handleInterval() {
    this.logger.log('interval 5s task');
  }

  @Timeout('timeoutTask', 10000)
  handleTimeout() {
    this.logger.log('timeout 10s task');
  }
}

```

## `Cron` 任务

`nest` 提供了类似 `linux cron` 功能的任务，底层是依赖 (node-cron)[https://github.com/kelektiv/node-cron] 包。

## cron 表达式

`cron` 任务是用类似 `* * * * * *` 6个描述符来明确一个任务按照怎样的规律来执行。

```ts
* * * * * *
| | | | | |
| | | | | day of week
| | | | months
| | | day of month
| | hours
| minutes
seconds
```

6个描述符依次表示 `秒、分、时、日、月、星期`。 每个描述符有下面种描述方式

- `*` : 所有，表示`第所有的`，例如：`* * * * * *` 表示所有的都执行任务， 例如秒 0-59 ，时 0-11 ，月 1-12
- `n` : 数字，表示`第几`，例如：`2 3 * * * *` 表示第02分钟03秒执行（每小时执行一次）
- `n-n` : 数字范围，表示`第几到第几`, 例如：`2 3-5 * * * *` 表示每小时第03、04、05分钟02秒执行（每小时执行3次）
- `n,m` : 数字组合，表示`第几和第几`，例如：`2 3-5 6,7 * * *` 表示每天06时和07时的第03、04、05分钟02秒执行（每天执行6次）
- `*/n` : 数字区间，表示`每几后`，例如：`2 3-5 6,7 * */3 *` 表示每3个月的...执行（每个季度执行6次）。

**注意** `*/n` 的描述方式，不是每隔多少后执行，而是从第一开始，第n后执行。 比如 `*/10 * * * * *` 表示第0，10，20，30，40，50秒执行，不是从当前开始后每隔10秒，**是绝对时间，不是相对时间**。

复杂场景：

- 组合 `n-n,m` : 例如：`2 3-5,7 * * * *` 表示第03、04、05分钟和07分钟的02秒执行
- 日和星期冲突 : 例如：`* * * */7 * 5` 表示每7天，且星期5执行，如果1号是星期三，每7天都是星期三，所有不会执行
- 时区问题 : cron 描述的是绝对时间的，第 n 执行，所以有时区的问题，默认是当前服务器的时区 , `@nestjs/schedule` 提供了 `CronOptions` 参数可以设置时区问题。

## cron 任务

通过 `@Cron` 来创建 `cron` 任务， `CronExpression` 也内置了很多常用的 `cron` 表达式，比如 `CronExpression.EVERY_5_SECONDS` 就是 `*/5 * * * * *`

```ts
@Cron('0 */3 * * * *')
handleCron() {
    this.logger.log(`cron task */3 * * * * * exec , now : ${Date.now()}`);
}
```

也可以通过 `schedulerRegistry.addCronJob` 来添加，通过 `schedulerRegistry.deleteCronJob` 删除

```ts
const job = new CronJob('*/5 * * * * *', () => {
    this.logger.log(`cron task */5 * * * * * exec , now : ${Date.now()}`);
});
this.schedulerRegistry.addCronJob('customCron', job);
job.start();// 需要在 addCronJob 之后启动。

this.schedulerRegistry.addTimeout(
    'customTimeout',
    setTimeout(() => {
    this.schedulerRegistry.deleteCronJob('customCron');
        this.logger.log('customTimeout task trigger , stop customCron');
    }, 20000),
);
```

## 总结

- `cron 表达式` 是核心，描述的是绝对时间下调度，需要注意时区
- cron job 底层是 `node-cron` 依赖 , 再底层是通过 `child_process.spawn` 创建子进程来执行任务，不阻塞主进程