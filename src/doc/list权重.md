# 打分计算说明

+ 根据如下分类对产品进行分类

|分类|产品类型|说明|
|---|---|--------------|
|cta0|CTA| cta0 目前是按照并且回撤小于10% 波动率小于0.15|
|cta1|CTA| 除上述条件外其他CTA|
|中性|中性|回撤小于10%且波动率小于0.15|
|指增|指增|指增超额回撤小于10%且波动率小于0.15|
|套利|期权,套利|回撤小于5%且波动率小于0.12|
|aas|中性, CTA, 期权,套利, 混合|回撤小于10%且波动率小于0.15|



## 评分计算

### 去极值
 首先将 8项数据 按照如下限制进行去极值

|数据项|sharpe|calmar|sortino|max_dd|dd_week|win_ratio|yeaily_return|volatility|
|-----|---|---|---|---|---|---|---|---|
|最大值|4|10|10|0|0|1|1|0|

### 得分计算
$$单项得分=\frac {value-Min}{Max-Min}  $$

$$总得分=\sum 单项得分\times单项权重	$$


同一个产品可能存在于2个分类 (aas或其它)
在不同的分类中 按照不同的打分权重进行计算总得分

在三个时间窗口 分别计算如下值
|数据名称|含义|计算方法|
|---|---|-----|
|rank|排名绝对值,得分最高的排第一名|按照总得分进行排序|
|rankR|排名分位值 值越小越好|rankR=rank/排名产品数|
|mean|排名分位值的平均值|rankR=rank/排名产品数|
|listrate|排名分位值<0.3的占比 越大越好|listrate=rankR<0.3占比|
|std|rankR标准差|标准差|
|Δrank|当前rank相对于近期排名均值提升量|近期平均排名-当前排名|




