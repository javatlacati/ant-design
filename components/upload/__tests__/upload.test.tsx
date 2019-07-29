/* eslint-disable react/no-string-refs, react/prefer-es6-class */
import React from 'react';
import { mount } from 'enzyme';
import Upload, { RcFile, UploadProps } from '..';
import Form from '../../form';
import { T, fileToObject, genPercentAdd, getFileItem, removeFileItem } from '../utils';
import { setup, teardown } from './mock';
import { UploadFile } from "../interface";

describe('Upload', () => {
  beforeEach(() => setup());
  afterEach(() => teardown());

  // https://github.com/react-component/upload/issues/36
  it('should get refs inside Upload in componentDidMount', () => {
    let ref;
    class App extends React.Component {
      componentDidMount() {
        ref = this.refs.input;
      }

      render() {
        return (
          <Upload supportServerRender={false}>
            <input ref="input" />
          </Upload>
        );
      }
    }
    mount(<App />);
    expect(ref).toBeDefined();
  });

  it('return promise in beforeUpload', done => {
    const data = jest.fn();
    // @ts-ignore
    const props = {beforeUpload: () => new Promise(resolve => setTimeout(() => resolve('success'), 100)),
      action: 'http://upload.com',
      data,
      onChange: ({ file }: { file: UploadFile }) => {
        if (file.status !== 'uploading') {
          expect(data).toHaveBeenCalled();
          done();
        }
      },
    } as UploadProps;

    const wrapper = mount(
      <Upload {...props}>
        <button type="button">upload</button>
      </Upload>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        files: [{ file: 'foo.png' }],
      },
    });
  });

  it('upload promise return file in beforeUpload', done => {
    const data = jest.fn();
    const props = {
      action: 'http://upload.com',
      beforeUpload: (file: UploadFile) =>
        new Promise(resolve =>
          setTimeout(() => {
            const result = file;
            result.name = 'test.png';
            resolve(result);
          }, 100),
        ),
      data,
      onChange: ({ file }: { file: UploadFile }) => {
        if (file.status !== 'uploading') {
          expect(data).toHaveBeenCalled();
          expect(file.name).toEqual('test.png');
          done();
        }
      },
    };

    // @ts-ignore
    const wrapper = mount<Upload>(<Upload {...props}>
        <button type="button">upload</button>
      </Upload>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        files: [{ file: 'foo.png' }],
      },
    });
  });

  it('should not stop upload when return value of beforeUpload is false', done => {
    const fileList = [
      {
        uid: 'bar',
        name: 'bar.png',
      },
    ];
    const mockFile = new File(['foo'], 'foo.png', {
      type: 'image/png',
    });
    const data = jest.fn();
    // @ts-ignore
    const props = {fileList,
      action: 'http://upload.com',
      beforeUpload: () => false,
      data,
      // tslint:disable-next-line:no-shadowed-variable
      onChange: ({ file, fileList : updatedFileList }: { file: File, fileList: File[]}) => {
        expect(file instanceof File).toBe(true);
        expect(updatedFileList.map((f: any) => f.name)).toEqual(['bar.png', 'foo.png']);
        expect(data).not.toHaveBeenCalled();
        done();
      },
    };

    // @ts-ignore
    const wrapper = mount(<Upload {...props}>
        <button type="button">upload</button>
      </Upload>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        files: [mockFile],
      },
    });
  });

  it('should increase percent automaticly when call autoUpdateProgress in IE', done => {
    let uploadInstance: any;
    let lastPercent: number = -1;
    const props = {
      action: 'http://upload.com',
      onChange: ({ file }: {file: UploadFile}) => {
        if (file.percent === 0 && file.status === 'uploading') {
          // manually call it
          uploadInstance.autoUpdateProgress(0, file);
        }
        if (file.status === 'uploading') {
          expect(file.percent!).toBeGreaterThan(lastPercent);
          lastPercent = file.percent!;
        }
        if (file.status === 'done' || file.status === 'error') {
          done();
        }
      },
    };

    const wrapper = mount<Upload>(
      <Upload {...props}>
        <button type="button">upload</button>
      </Upload>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        files: [{ file: 'foo.png' }],
      },
    });

    uploadInstance = wrapper.instance();
  });

  it('should not stop upload when return value of beforeUpload is not false', done => {
    const data = jest.fn();
    const props = {
      action: 'http://upload.com',
      beforeUpload() {},
      data,
      onChange: () => {
        expect(data).toHaveBeenCalled();
        done();
      },
    };

    // @ts-ignore
    const wrapper = mount<Upload>(<Upload {...props}>
        <button type="button">upload</button>
      </Upload>,
    );

    wrapper.find('input').simulate('change', {
      target: {
        files: [{ file: 'foo.png' }],
      },
    });
  });

  // https://github.com/ant-design/ant-design/issues/14779
  it('should contain input file control if upload button is hidden', () => {
    const wrapper = mount(
      <Upload action="http://upload.com">
        <button type="button">upload</button>
      </Upload>,
    );

    expect(wrapper.find('input[type="file"]').length).toBe(1);
    wrapper.setProps({ children: null });
    expect(wrapper.find('input[type="file"]').length).toBe(1);
  });

  // https://github.com/ant-design/ant-design/issues/14298
  it('should not have id if upload children is null, avoid being triggered by label', () => {
    // eslint-disable-next-line
    class Demo extends React.Component {
      render() {
        const props = this.props as any;
        const form = props.form as any;
        const getFieldDecorator = form[`getFieldDecorator`] as Function;
        const children = props.children;
        // const {
        //   form: { getFieldDecorator },
        //   children,
        // } = this.props;
        return (
          <Form>
            <Form.Item label="Upload">
              {getFieldDecorator('upload')(<Upload>{children}</Upload>)}
            </Form.Item>
          </Form>
        );
      }
    }
    const WrappedDemo = Form.create()(Demo);
    const wrapper = mount(
      <WrappedDemo>
        <div>upload</div>
      </WrappedDemo>,
    );
    expect(wrapper.find('input#upload').length).toBe(1);
    wrapper.setProps({ children: null });
    expect(wrapper.find('input#upload').length).toBe(0);
  });

  // https://github.com/ant-design/ant-design/issues/16478
  it('should not have id if upload is disabled, avoid being triggered by label', () => {
    // eslint-disable-next-line
    class Demo extends React.Component {
      render() {
        // const {
        //   form: { getFieldDecorator },
        //   disabled,
        // } = this.props;
        const props = this.props as any;
        const disabled = props.disabled as boolean;
        const form = props.form as any;
        const getFieldDecorator = form.getFieldDecorator as Function;
        return (
          <Form>
            <Form.Item label="Upload">
              {getFieldDecorator('upload')(
                <Upload disabled={disabled}>
                  <div>upload</div>
                </Upload>,
              )}
            </Form.Item>
          </Form>
        );
      }
    }
    const WrappedDemo = Form.create()(Demo);
    const wrapper = mount(<WrappedDemo />);
    expect(wrapper.find('input#upload').length).toBe(1);
    wrapper.setProps({ disabled: true });
    expect(wrapper.find('input#upload').length).toBe(0);
  });

  it('should be controlled by fileList', () => {
    const fileList = [
      {
        uid: '-1',
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
      },
    ];
    const wrapper = mount(<Upload />);
    let state: any = wrapper.instance().state;
    expect(state.fileList).toEqual([]);
    wrapper.setProps({ fileList });
    state = wrapper.instance().state;
    expect(state.fileList).toEqual(fileList);
  });

  describe('util', () => {
    // https://github.com/react-component/upload/issues/36
    it('should T() return true', () => {
      const res = T();
      expect(res).toBe(true);
    });

    it('should be able to copy file instance', () => {
      const file = new File([], 'aaa.zip') as any as RcFile;
      const copiedFile = fileToObject(file);
      ['uid', 'lastModified', 'lastModifiedDate', 'name', 'size', 'type'].forEach(key => {
        expect(key in copiedFile).toBe(true);
      });
    });

    it('should be able to progress from 0.1 ', () => {
      // 0.1 -> 0.98
      const getPercent = genPercentAdd();
      let curPercent = 0;
      curPercent = getPercent(curPercent);
      expect(curPercent).toBe(0.1);
    });

    it('should be able to progress to 0.98 ', () => {
      // 0.1 -> 0.98
      const getPercent = genPercentAdd();
      let curPercent = 0;
      for (let i = 0; i < 500; i += 1) {
        curPercent = getPercent(curPercent);
      }
      expect(parseFloat(curPercent.toFixed(2))).toBe(0.98);
    });

    it('should be able to get fileItem', () => {
      const file: UploadFile = { uid: '-1', name: 'item.jpg' } as any as UploadFile;
      const fileList = [
        {
          uid: '-1',
          name: 'item.jpg',
        },
      ] as any as UploadFile[];
      const targetItem = getFileItem(file, fileList);
      expect(targetItem).toBe(fileList[0]);
    });

    it('should be able to remove fileItem', () => {
      const file = { uid: '-1', name: 'item.jpg' } as UploadFile;
      const fileList = [
        {
          uid: '-1',
          name: 'item.jpg',
        },
        {
          uid: '-2',
          name: 'item2.jpg',
        },
      ] as UploadFile[];
      const targetItem = removeFileItem(file, fileList);
      expect(targetItem).toEqual(fileList.slice(1));
    });

    it('should not be able to remove fileItem', () => {
      const file = { uid: '-3', name: 'item.jpg' } as UploadFile;
      const fileList = [
        {
          uid: '-1',
          name: 'item.jpg',
        },
        {
          uid: '-2',
          name: 'item2.jpg',
        },
      ] as UploadFile[];
      const targetItem = removeFileItem(file, fileList);
      expect(targetItem).toBe(null);
    });
  });

  it('should support linkProps as object', () => {
    const fileList = [
      {
        uid: '-1',
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
        linkProps: {
          download: 'image',
          rel: 'noopener',
        },
      },
    ] as UploadFile[];
    const wrapper = mount(<Upload fileList={fileList} />);
    const linkNode = wrapper.find('a.ant-upload-list-item-name');
    expect(linkNode.props().download).toBe('image');
    expect(linkNode.props().rel).toBe('noopener');
  });

  it('should support linkProps as json stringify', () => {
    const linkPropsString = JSON.stringify({
      download: 'image',
      rel: 'noopener',
    });
    const fileList = [
      {
        uid: '-1',
        name: 'foo.png',
        status: 'done',
        url: 'http://www.baidu.com/xxx.png',
        linkProps: linkPropsString,
      },
    ] as UploadFile[];
    const wrapper = mount(<Upload fileList={fileList} />);
    const linkNode = wrapper.find('a.ant-upload-list-item-name');
    expect(linkNode.props().download).toBe('image');
    expect(linkNode.props().rel).toBe('noopener');
  });

  it('should not stop remove when return value of onRemove is false', done => {
    const mockRemove = jest.fn(() => false);
    const props = {
      onRemove: mockRemove,
      fileList: [
        {
          uid: '-1',
          name: 'foo.png',
          status: 'done',
          url: 'http://www.baidu.com/xxx.png',
        },
      ],
    };

    // @ts-ignore
    const wrapper = mount(<Upload {...props} />);

    wrapper.find('div.ant-upload-list-item i.anticon-close').simulate('click');

    setImmediate(() => {
      wrapper.update();

      expect(mockRemove).toHaveBeenCalled();
      expect(props.fileList).toHaveLength(1);
      expect(props.fileList[0].status).toBe('done');
      done();
    });
  });

  // https://github.com/ant-design/ant-design/issues/14439
  it('should allow call abort function through upload instance', () => {
    const wrapper = mount<Upload>(
      <Upload>
        <button type="button">upload</button>
      </Upload>,
    );
    expect(typeof wrapper.instance().upload.abort).toBe('function');
  });

  it('unmount', () => {
    const wrapper = mount(
      <Upload>
        <button type="button">upload</button>
      </Upload>,
    );
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    expect(clearIntervalSpy).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('corrent dragCls when type is drag', () => {
    const fileList = [{ status: 'uploading', uid: 'file' }] as UploadFile[];
    const wrapper = mount(
      <Upload type="drag" fileList={fileList}>
        <button type="button">upload</button>
      </Upload>,
    );
    expect(wrapper.find('.ant-upload-drag-uploading').length).toBe(1);
  });

  it('return when targetItem is null', () => {
    const fileList = [{ uid: 'file' }] as UploadFile[];
    const wrapper = mount<Upload>(
      <Upload type="drag" fileList={fileList}>
        <button type="button">upload</button>
      </Upload>,
    ).instance();
    const newVar = { uid: 'fileItem' } as UploadFile;
    expect(wrapper.onSuccess('', newVar)).toBe(undefined);
    expect(wrapper.onProgress({ percent: 0 }, newVar)).toBe(undefined);
    expect(wrapper.onError(new Error(''), '', newVar)).toBe(undefined);
  });
});
