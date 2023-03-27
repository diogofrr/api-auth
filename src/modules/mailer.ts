import nodemailer, { TransportOptions } from "nodemailer";
import path from "path";
import hbs, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";

import { user, pass, host, port } from "../config/mail.json";

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
} as TransportOptions);

transport.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/mail/')
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html',
} as NodemailerExpressHandlebarsOptions));

export default transport;