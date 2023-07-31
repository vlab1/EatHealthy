const apiUrl = process.env.REACT_APP_URL;

function createQueryString(data) {
  let queryArray = [];

  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let value = data[key];
      let newKey = key;
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            queryArray.push(`${newKey}=${encodeURIComponent(item)}`);
          });
        } else {
          queryArray.push(`${newKey}=${encodeURIComponent(value)}`);
        }
      }
    }
  }

  return queryArray.join("&");
}

export const dataProvider = {
  getList: async (resource, params) => {
    const queryParams = { ...params.filter, ...params.pagination };
    let query = `/find?${createQueryString(queryParams)}`;

    const url = apiUrl + `api/${resource}/admin${query}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };

    return fetch(url, {
      method: "GET",
      body: null,
      headers: new Headers(headers),
    })
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        const data = json.data.data.map((item) => ({
          ...item,
          id: item._id,
        }));
        return { data, total: json.data.total };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  getOne: async (resource, params) => {
    let query = `/admin/find?_id=${params.id}`;
    const request = new Request(apiUrl + `api/` + resource + query, {
      method: "GET",
      body: null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        const data = {
          ...json?.data?.data[0],
          id: json?.data?.data[0]?._id,
        };
        return { data };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  update: async (resource, params) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    let query = "/admin/update";
    let body = { ...params.data };
    body._id = body.id;
    let formData = undefined;
    if (body && !body.files) {
      body = JSON.stringify(body);
    }
    if (body && body.files) {
      if (body) {
        const { files, ...newObject } = JSON.parse(JSON.stringify(body));
        formData = new FormData();
        for (let key in newObject) {
          formData.append(key, JSON.stringify(newObject[key]));
        }
      }
      if (body && body.files) {
        delete headers['Content-Type'];
        for (let i = 0; i < body.files.length; i++) {
          formData.append("files", body.files[i].rawFile);
        }
      }
      body = formData;
    }
    const request = new Request(apiUrl + `api/` + resource + query, {
      method: "PUT",
      body: body,
      headers: headers,
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        const data = {
          ...json.data,
          id: json.data._id,
        };
        return { data };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  create: async (resource, params) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    let query = "/admin/create";
    let body = { ...params.data };
    let formData = undefined;
    if (body && !body.files) {
      body = JSON.stringify(body);
    }
    if (body && body.files) {
      if (body) {
        const { files, ...newObject } = JSON.parse(JSON.stringify(body));

        formData = new FormData();
        for (let key in newObject) {
          formData.append(key, JSON.stringify(newObject[key]));
        }
      }
      if (body && body.files) {
        for (let i = 0; i < body.files.length; i++) {
          formData.append("files", body.files[i]);
        }
      }
      body = formData;
    }
    const request = new Request(apiUrl + `api/` + resource + query, {
      method: "POST",
      body: body,
      headers: headers,
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        const data = {
          ...json.data,
          id: json.data._id,
        };
        return { data };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  delete: async (resource, params) => {
    let query = "/admin/delete";
    let body = { _id: params.id };
    body = JSON.stringify(body);
    const request = new Request(apiUrl + `api/` + resource + query, {
      method: "DELETE",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        const data = {
          ...json.data,
          id: json.data._id,
        };
        return { data };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  deleteMany: async (resource, params) => {
    let query = "/admin/delete";
    const _ids = [];
    await Promise.all(
      params.ids.map(async (id) => {
        let body = { _id: id };
        body = JSON.stringify(body);
        const request = new Request(apiUrl + `api/` + resource + query, {
          method: "DELETE",
          body: body,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        await fetch(request)
          .then(async (response) => {
            if (response.status < 200 || response.status >= 300) {
              throw new Error(response.statusText);
            }
            const json = await response.json();
            _ids.push(json["data"]._id);
          })
          .catch(() => {
            throw new Error("Network error");
          });
      })
    );
    return { data: _ids };
  },
};
