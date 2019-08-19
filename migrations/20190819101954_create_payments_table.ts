import * as Knex from 'knex'

// See https://www.xe.com/iso4217.php
const currencyCodes =
  'AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTN,BWP,BYN,BZD,CAD,CDF,CHF,CLP,CNY,COP,CRC,CUC,CUP,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GGP,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,IMP,INR,IQD,IRR,ISK,JEP,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRU,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SPL,SRD,STN,SVC,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TVD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XCD,XDR,XOF,XPF,YER,ZAR,ZMW,ZWD'

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('payments', table => {
      table
        .integer('id', 11)
        .notNullable()
        .unsigned()
        .unique()
        .comment('Bunq payment ID')
      table
        .enum('currency', currencyCodes.split(','))
        .notNullable()
        .defaultTo('EUR')
        .comment('ISO 4217 currency code')
      table.float('amount', 8, 2).notNullable()
      table.string('iban', 32).nullable()
      // TODO: Use table.string('description').collate('utf8mb4_bin') when TypeScript
      //   adds a type definiton for the method
      table.string('description', 255).nullable()
      table
        .string('category', 64)
        .nullable()
        .index()
      table.dateTime('created_at').notNullable()
    })
    .then(() =>
      knex.raw(
        // Allow unicode characters, include emoji
        'ALTER TABLE `payments` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin',
      ),
    )
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('payments')
}
