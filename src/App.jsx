import {
  Container,
  Box,
  Flex,
  Text,
  Image,
  Center,
  SimpleGrid,
  Card, CardBody,
  Heading,
  Skeleton,
  Input,
  Textarea,
  Stack,
  Tooltip
} from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

import CoffeeLogo from './coffee.svg'
import {
  ConnectWallet,
  useContract,
  useContractRead,
  Web3Button
} from "@thirdweb-dev/react";
import { BUYACOFFEE_ADDRESS } from './const/contractAddress'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'


export default function Home() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const { contract } = useContract(BUYACOFFEE_ADDRESS)
  const {
    data: totalCoffee,
    isLoading: loadingTotalCoffee
  } = useContractRead(contract, 'getTotalCoffee')

  const {
    data: recentCoffee,
    isLoading: loadingRecentCoffee
  } = useContractRead(contract, 'getAllCoffee')

  useEffect(() => {
    if (recentCoffee) {
      console.log('recentCoffee', recentCoffee)
    }
  }, [recentCoffee])


  return (
    <Box bg='#FEFEFE' w={'100%'} h={'100%'}>
      <Container maxW={'1200px'} w={'100%'}>

        {/* Navbar */}
        <Flex
          px={'10px'}
          bg={{ base: '#fff' }}
          h={'120px'}
          borderRadius={'20px'}
          boxShadow={'lg'}
        >
          <Center w='100%'>
            <Image
              src={CoffeeLogo}
              width={50}
              height={50}
              alt='Buy Me a Coffee'
            />

            <Text
              w='100%'
              fontWeight={600}
              fontSize={'24px'}
            >
              Buy Me A Coffee
            </Text>

            <Box mr='2rem'>
              <ConnectWallet
                btnTitle='連接錢包'
              />
            </Box>
          </Center>

        </Flex>

        <Flex
          w={'100%'}
          alignItems={'center'}
          justifyContent={'space-between'}
          py={'20px'}
          height='100px'
          flexDirection={'column'}
        >
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={10}
            mt={'40px'}
            w={'100%'}
          >
            {/* 左半邊卡片 */}
            <Box>
              <Card>
                <CardBody>
                  <Heading
                    size='md'
                    mb='20px'
                  >
                    Buy Me a Coffee
                  </Heading>

                  <Flex>
                    <Text>Total Coffees：</Text>
                    <Skeleton
                      isLoaded={!loadingTotalCoffee}
                      width={'20px'}
                    >
                      {totalCoffee?.toString()}
                    </Skeleton>
                  </Flex>

                  {/* 你的名字 */}
                  <Text
                    fontSize='xl'
                    py='10px'
                  >
                    你的名字
                  </Text>

                  <Input
                    bg='gray.100'
                    maxLength={16}
                    placeholder='請輸入名字，例：Hazel'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  {/* 你的訊息 */}
                  <Text
                    fontSize='xl'
                    py='10px'
                  >
                    你的訊息
                  </Text>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    size='lg'
                    bg={'gray.100'}
                  />

                  <Box mt={'20px'}>
                    <Center>
                      <Web3Button
                        contractAddress={BUYACOFFEE_ADDRESS}
                        action={async () => {
                          await contract.call('buyCoffee', [message, name], {
                            value: ethers.utils.parseEther('0.01')
                          })
                        }}
                        onSuccess={() => {
                          setMessage('')
                          setName('')
                          alert('你購買的咖啡成功囉！')
                        }}
                        onError={(error) => {
                          alert(error)
                        }}
                      >
                        買一杯咖啡 0.01 ETH
                      </Web3Button>
                    </Center>

                  </Box>

                </CardBody>
              </Card>
            </Box>

            {/* 右半邊卡片 */}
            <Box>
              <Card maxH={'50vh'} overflow={'scroll'}>
                <CardBody>
                  <Text fontWeight={'bold'}>誰買了咖啡</Text>
                  {!loadingRecentCoffee ?
                    (
                      <Box>
                        {recentCoffee && recentCoffee?.map((coffee, index) => {
                          return (
                            <Card key={index} my={'10px'}>
                              <CardBody>
                                <Flex alignItems={'center'} mb='10px'>
                                  <Image
                                    src={CoffeeLogo}
                                    alt='Coffee'
                                    width={30}
                                    height={30}
                                    mr={'10px'}
                                  />
                                  <Text fontWeight={'bold'} mr='10px'>
                                    {coffee[2] ? coffee[2] : '匿名人士'}
                                  </Text>
                                  <Tooltip
                                    label={`錢包地址：${coffee[0]}`}
                                    bg={'gray.200'}
                                    color='black'
                                  >
                                    <InfoOutlineIcon />
                                  </Tooltip>
                                </Flex>

                                <Flex>
                                  <Text>
                                    {coffee[1] ? coffee[1] : '這個人什麼都沒留下'}
                                  </Text>
                                </Flex>
                              </CardBody>
                            </Card>
                          )
                        })}
                      </Box>
                    ) : (
                      <Stack>
                        <Skeleton height={'100px'} />
                        <Skeleton height={'100px'} />
                        <Skeleton height={'100px'} />
                      </Stack>
                    )}
                </CardBody>
              </Card>
            </Box>
          </SimpleGrid>
        </Flex>
      </Container>
    </Box>
  );
}
