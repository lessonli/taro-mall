function gerRestfulArgs(url) {
  const restfulReg = /\{[^ \{]{0,}\}/gi;
  // 提取{}中间字符
  const reg2 = /[^\{]\S{0,}[^\}]/;
  const args = [];
  Array.from(url.matchAll(restfulReg)).forEach((item) => {
    // @ts-ignore
    const [code] = item;
    const argName = Array.from(code.match(reg2))[0];
    // @ts-ignore
    args.push(argName);
    url = url.replace(code, `$${code}`);
  });

  return {
    url,
    args,
  };
}

// gerRestfulArgs('/user/list/{id}/{age}/34/{is}')

const genProject = (projectId) => {
  return {
    notCheckGit: true,
    target: 'ts',
    serverUrl: 'http://yapi.bwyd.com',
    outputFilePath: `src/apis/${projectId}`,
    projectId,
    customizeFilter: (api) => {
      return true;
    },
    generateApiName: (path, _id) => {
      return `api${_id}`;
    },
    generateApiFileCode: (api) => {
      const { url, args } = gerRestfulArgs(api.path);
      const header = (api.req_headers || [{
        "name": "Content-Type",
        "value": "application/json"
      }]).reduce((res, item) => {
        res[item.name] = item.value
        return res
      }, {})
      return `
      // @ts-nocheck
      /**
      * ${api.title}
      * http://yapi.bwyd.com/project/${projectId}/interface/api/${api.id}
      **/

      import request from '@/service/http.ts'

      ${api.requestInterface}

      ${api.responseInterface}

      export const req${api.id}Config = (${args.length ? args.join(',') + ',' : ''} data: ${
        api.reqInterfaceName
      }) => ({
        url: \`${url}\`,
        method: '${api.method.toUpperCase()}',
        header: ${JSON.stringify(header, null, 2)},
        yapi: '${projectId}',
        data,
      })

      /**
      * ${api.title}
      **/
      export default function (${args.length ? args.join(',') + ',' : ''} data: ${
        api.reqInterfaceName
      } = {}): Promise<${api.resInterfaceName}['data']> {
        return request(req${api.id}Config(...arguments))
      }

      
      `;
    },
  };
};

module.exports = [genProject(21)];
