<?xml version="1.0" encoding="utf-8"?>
<Project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <ID>0841918a-3573-4f12-b6ad-8034dbed3258</ID>
  <Version>4</Version>
  <Name />
  <Author>Mike Ashby</Author>
  <Company>Cambridge University</Company>
  <Notes />
  <Template />
  <PassNA>false</PassNA>
  <FailEstimatedRecords>false</FailEstimatedRecords>
  <ResultType>0</ResultType>
  <ResultStage>-1</ResultStage>
  <RankByType>0</RankByType>
  <RankByStage>-1</RankByStage>
  <RankByProperty />
  <IndexRankColumn>0</IndexRankColumn>
  <RankOrder>1</RankOrder>
  <Database>
    <Path>C:\Program Files (x86)\CES EduPack 2017\Database\English Level 2\data.gdb</Path>
    <Name>Level 2</Name>
    <Unit>Metric</Unit>
    <UnitType>Relative</UnitType>
    <Currency>USD</Currency>
    <SelectionTable>MaterialUniverse</SelectionTable>
    <Tables>
      <Table>
        <TableName>MaterialUniverse</TableName>
        <SubsetName>All materials</SubsetName>
        <LayoutName>All properties</LayoutName>
        <CompareTable>
          <Windowplacement />
          <ZOrder>-1</ZOrder>
          <ShowProjectData>false</ShowProjectData>
          <ShowRanges>true</ShowRanges>
          <ShowValues>true</ShowValues>
          <PercentError>10</PercentError>
        </CompareTable>
        <UserDefinedNearnessSettings />
        <CompareRecords />
        <RecordCustomLabels />
        <UserRecords />
      </Table>
      <Table>
        <TableName>Reference</TableName>
        <SubsetName>Materials References</SubsetName>
        <LayoutName>All Details</LayoutName>
        <CompareTable>
          <Windowplacement />
          <ZOrder>-1</ZOrder>
          <ShowProjectData>false</ShowProjectData>
          <ShowRanges>true</ShowRanges>
          <ShowValues>true</ShowValues>
          <PercentError>10</PercentError>
        </CompareTable>
        <UserDefinedNearnessSettings />
        <CompareRecords />
        <RecordCustomLabels />
        <UserRecords />
      </Table>
      <Table>
        <TableName>ProcessUniverse</TableName>
        <SubsetName>All Processes</SubsetName>
        <LayoutName>Surface Treatment</LayoutName>
        <CompareTable>
          <Windowplacement />
          <ZOrder>-1</ZOrder>
          <ShowProjectData>false</ShowProjectData>
          <ShowRanges>true</ShowRanges>
          <ShowValues>true</ShowValues>
          <PercentError>10</PercentError>
        </CompareTable>
        <UserDefinedNearnessSettings />
        <CompareRecords />
        <RecordCustomLabels />
        <UserRecords />
      </Table>
      <Table>
        <TableName>Producers</TableName>
        <SubsetName>Producers</SubsetName>
        <LayoutName>Producers</LayoutName>
        <CompareTable>
          <Windowplacement />
          <ZOrder>-1</ZOrder>
          <ShowProjectData>false</ShowProjectData>
          <ShowRanges>true</ShowRanges>
          <ShowValues>true</ShowValues>
          <PercentError>10</PercentError>
        </CompareTable>
        <UserDefinedNearnessSettings />
        <CompareRecords />
        <RecordCustomLabels />
        <UserRecords />
      </Table>
    </Tables>
    <ParameterValues>
      <ParameterValue>
        <Name>Material Cost</Name>
        <Value>10</Value>
      </ParameterValue>
      <ParameterValue>
        <Name>Component Mass</Name>
        <Value>1</Value>
      </ParameterValue>
      <ParameterValue>
        <Name>Batch Size</Name>
        <Value>1000</Value>
      </ParameterValue>
      <ParameterValue>
        <Name>Overhead Rate</Name>
        <Value>110</Value>
      </ParameterValue>
      <ParameterValue>
        <Name>Capital Write-off Time</Name>
        <Value>5</Value>
      </ParameterValue>
      <ParameterValue>
        <Name>Load Factor</Name>
        <Value>0.5</Value>
      </ParameterValue>
      <ParameterValue>
        <Name>Discount Rate</Name>
        <Value>5</Value>
      </ParameterValue>
      <ParameterValue>
        <Name>Component Length</Name>
        <Value>1</Value>
      </ParameterValue>
    </ParameterValues>
  </Database>
  <Stages>
    <Stage xsi:type="BubbleStageMemento">
      <Name />
      <Notes />
      <Windowplacement>0,1,-1,-1,-1,-1,0,66,825,595</Windowplacement>
      <ZOrder>1</ZOrder>
      <SelectWholeRecords>false</SelectWholeRecords>
      <Enabled>true</Enabled>
      <PassNA>false</PassNA>
      <HideFailedRecords>false</HideFailedRecords>
      <ResultIntersection>true</ResultIntersection>
      <ShowFavourites>false</ShowFavourites>
      <ShowVirtualRecords>false</ShowVirtualRecords>
      <ShowUserRecords>false</ShowUserRecords>
      <ShowReferenceMaterial>false</ShowReferenceMaterial>
      <FailEstimates>false</FailEstimates>
      <xAxis>
        <Name>Low                   -- Acoustic pitch --                    High</Name>
        <FunctionObjective />
        <Expression>50* ( [Young's modulus] / [Density] )  ^ 0.5</Expression>
        <ExpressionType>1</ExpressionType>
        <AbsoluteValues>true</AbsoluteValues>
        <LogAxis>true</LogAxis>
        <Low>0.00897581</Low>
        <High>99.4242</High>
      </xAxis>
      <yAxis>
        <Name>Dull          -- Acoustic brightness --           Bright</Name>
        <FunctionObjective />
        <Expression>(1/20)*(1 / [Mechanical loss coefficient (tan delta)]) ^ 0.5</Expression>
        <ExpressionType>1</ExpressionType>
        <AbsoluteValues>true</AbsoluteValues>
        <LogAxis>true</LogAxis>
        <Low>0.0175863</Low>
        <High>47.5347</High>
      </yAxis>
      <Selections />
      <Labels>
        <Label>
          <Text>Pitch and Brightness</Text>
          <TextColor>#FF000000</TextColor>
          <Border>true</Border>
          <BorderColor>#FFff0000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Arial</FaceName>
          <PointSize>143</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.039881143499701732</XPos>
          <YPos>29.916246910064444</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Technical &#xD;
ceramics</Text>
          <TextColor>#FFff0000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Arial</FaceName>
          <PointSize>120</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>52.035794141945622</XPos>
          <YPos>20.478387199816442</YPos>
          <InitialXPos>19.934737231185469</InitialXPos>
          <InitialYPos>17.886793834201384</InitialYPos>
          <RecordGruid>EDU04-232</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Composites</Text>
          <TextColor>#FFff0000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Arial</FaceName>
          <PointSize>120</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>28.387588400348257</XPos>
          <YPos>0.46336665605101107</YPos>
          <InitialXPos>13.478581087516112</InitialXPos>
          <InitialYPos>0.71659376549378528</InitialYPos>
          <RecordGruid>EDU04-4329</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Glasses</Text>
          <TextColor>#FFff0000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Arial</FaceName>
          <PointSize>120</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>3.8623217139147945</XPos>
          <YPos>15.390048994017413</YPos>
          <InitialXPos>8.3425408127190543</InitialXPos>
          <InitialYPos>10.568388144938661</InitialYPos>
          <RecordGruid>EDU04-52</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Metals</Text>
          <TextColor>#FFff0000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Arial</FaceName>
          <PointSize>120</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>1.6576843622031621</XPos>
          <YPos>5.0591261734153878</YPos>
          <InitialXPos>3.6721237218961065</InitialXPos>
          <InitialYPos>4.9092710500222321</InitialYPos>
          <RecordGruid>EDU04-1590</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Elastomers</Text>
          <TextColor>#FFff0000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Arial</FaceName>
          <PointSize>120</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.022952905794987107</XPos>
          <YPos>0.15232117704283527</YPos>
          <InitialXPos>0.052145724890309983</InitialXPos>
          <InitialYPos>0.11108260078787978</InitialYPos>
          <RecordGruid>EDU04-4083</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Polymers</Text>
          <TextColor>#FFff0000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Arial</FaceName>
          <PointSize>120</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.38125127471305942</XPos>
          <YPos>1.2120548443249259</YPos>
          <InitialXPos>0.98788786197937506</InitialXPos>
          <InitialYPos>0.29962395471295528</InitialYPos>
          <RecordGruid>Xe6316629-83a2-40e1-82d0-201426288240</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Silica glass</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>4.1139818511584867</XPos>
          <YPos>23.445473022881174</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-116</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Aluminum &#xD;
nitride</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>15.683305327701007</XPos>
          <YPos>23.445473022881174</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-233</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Zirconia</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>24.396924254054202</XPos>
          <YPos>2.1153343281266448</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU05-6101</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>CFRP</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>24.706877558746967</XPos>
          <YPos>0.87127103014080309</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-13171</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Neoprene</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.019726237262333704</XPos>
          <YPos>0.030033178630297828</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-4092</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Rubber </Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.15058186156381453</XPos>
          <YPos>0.026629762924592168</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-4087</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Flexible Polymer Foams</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.85979915248444638</XPos>
          <YPos>0.034905494748892943</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-4203</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Rigid Polymer Foams</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>2.7122546439432234</XPos>
          <YPos>0.048588925548735389</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-4210</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Paper and cardboard</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>19.43770313870899</XPos>
          <YPos>0.143431086243411</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU08-6144</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Nylons, PA</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>1.0928735887134522</XPos>
          <YPos>1.1249948180826728</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-7260</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>PTFE</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.30535752737887784</XPos>
          <YPos>0.53853914627884536</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-13554</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>PE</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.42938199487287254</XPos>
          <YPos>0.66470167928075663</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-9775</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>PP</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.73893049670276589</XPos>
          <YPos>0.80817800088478309</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU04-7267</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Foams</Text>
          <TextColor>#FFff0000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Arial</FaceName>
          <PointSize>120</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>0.14316653735591883</XPos>
          <YPos>0.39273809562222262</YPos>
          <InitialXPos>0.24637763535228252</InitialXPos>
          <InitialYPos>0.2821366675556895</InitialYPos>
          <RecordGruid>EDU04-7014</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Bronze</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>2.8527361271910143</XPos>
          <YPos>9.0931898050616038</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU05-6102</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Brass</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>2.0287400507358324</XPos>
          <YPos>3.422275858484797</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU05-6104</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Copper</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>1.5562806396803477</XPos>
          <YPos>2.3150187700618581</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU05-6106</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Silver</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>1.6738560005151988</XPos>
          <YPos>1.5387352602387239</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU12-6184</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
        <Label>
          <Text>Lead</Text>
          <TextColor>#FF000000</TextColor>
          <Border>false</Border>
          <BorderColor>#FF000000</BorderColor>
          <Fill>true</Fill>
          <FillColor>#FFffffff</FillColor>
          <RoundedCorners>false</RoundedCorners>
          <FaceName>Tahoma</FaceName>
          <PointSize>98</PointSize>
          <Italic>false</Italic>
          <Weight>700</Weight>
          <XPos>6.0082213749122308</XPos>
          <YPos>0.066627197043784059</YPos>
          <InitialXPos>0</InitialXPos>
          <InitialYPos>0</InitialYPos>
          <RecordGruid>EDU05-6122</RecordGruid>
          <Bar xsi:nil="true" />
        </Label>
      </Labels>
      <Curves />
      <ShowEnvelopes>true</ShowEnvelopes>
    </Stage>
  </Stages>
</Project>