import { defineComponent, computed, reactive } from 'vue'

import { travelNode, randomId } from "./util";
import { ROOT_TYPES, VALUE_TYPES } from "./type";

import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import './index.css';

export default defineComponent({
    name: "VueJsonEditor",
    props: {
        onChange: {
            type: Function,
            required: false,
        }
    },
    components: {
        VueJsonPretty,
    },
    setup(props) {

        const treeArray = reactive([{
            key: "root",
            value: [],
            type: "array",
            isRoot: true,
            children: []
        }])

        let jsonText = computed(() => {
            const root = treeArray[0]
            const json = travelNode(root).root;
            if (props.onChange)
                props.onChange(JSON.stringify(json))
            return json;
        })

        const onChangeType = (data) => {
            const { type } = data;
            if (type === "number") {
                data.value = 0;
            } else if (type === "string") {
                data.value = "value";
            } else if (type === "boolean") {
                data.value = true;
            } else if (type === "array") {
                data.value = [];
            } else if (type === "object") {
                data.value = {};
            }
            data.children = [];
        }

        const append = (data) => {
            const newChild = {
                key: data.type === "array" ? data.children.length : randomId(),
                value: "value",
                type: "string",
                children: []
            };
            if (!data.children) {
                data.children = [];
            }
            data.children.push(newChild);
        }

        const remove = (node, data) => {
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.key === data.key);
            children.splice(index, 1);
        }

        const renderContent = (h, { node, data }) => {
            const isRoot = data.isRoot;
            const parentType = node.parent.data.type;
            return (
                <el-row class="flex" gutter={8}>
                    <el-col span={5}>
                        <el-input
                            placeholder="key"
                            v-model={data.key}
                            disabled={parentType === "array" || isRoot}
                        ></el-input>
                    </el-col>
                    <el-col span={5}>
                        {isRoot ? (
                            <el-select
                                v-model={data.type}
                                onChange={() => onChangeType(data)}
                            >
                                {ROOT_TYPES.map((type) => (
                                    <el-option
                                        key={type.value}
                                        label={type.label}
                                        value={type.value}
                                    ></el-option>
                                ))}
                            </el-select>
                        ) : (
                                <el-select
                                    v-model={data.type}
                                    onChange={() => onChangeType(data)}
                                >
                                    {VALUE_TYPES.map((type) => (
                                        <el-option
                                            key={type.value}
                                            label={type.label}
                                            value={type.value}
                                        ></el-option>
                                    ))}
                                </el-select>
                            )}
                    </el-col>
                    <el-col span={11}>
                        {data.type === "string" && (
                            <el-input
                                placeholder="value"
                                v-model={data.value}
                                type="text"
                            ></el-input>
                        )}
                        {data.type === "number" && (
                            <el-input
                                placeholder="value"
                                v-model={data.value}
                                type="number"
                            ></el-input>
                        )}
                        {data.type === "boolean" && (
                            <el-select v-model={data.value}>
                                <el-option label="true" value={true}></el-option>
                                <el-option label="false" value={false}></el-option>
                            </el-select>
                        )}
                    </el-col>
                    <el-col span={3}>
                        {data.type === "object" && (
                            <i class="el-icon-plus" onClick={() => append(data)} />
                        )}
                        {data.type === "array" && (
                            <i class="el-icon-plus" onClick={() => append(data)} />
                        )}
                        {!isRoot && (
                            <i
                                class="el-icon-delete"
                                onClick={() => remove(node, data)}
                            />
                        )}
                    </el-col>
                </el-row>
            );
        }

        return () => {
            return (
                <section class="vue-json-editor">
                    <div class="select">
                        <el-tree
                            node-key="key"
                            data={treeArray}
                            indent="10"
                            expand-on-click-node={false}
                            render-content={renderContent}
                            default-expand-all
                        />
                    </div>
                    <vue-json-pretty
                        class="json"
                        data={jsonText.value}
                    >
                    </vue-json-pretty>
                </section>
            )
        }
    },
})

